/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import { whereMostlyLive } from '../../@types/fields';
import formFields from '../../constants/formFields';
import FORM_STEPS from '../../constants/formSteps';
import paths from '../../constants/paths';
import checkFormProgressFromConfig  from '../../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../../utils/addCompletedStep';
import { isDesign2, isDesign3, isPerChildPoCEnabled, getSessionValue, setSessionSection } from '../../utils/perChildSession';
import { getBackUrl, getRedirectUrlAfterFormSubmit } from '../../utils/sessionHelpers';

// Helper to get the field name for a specific child index
const getFieldName = (childIndex: number) => `${formFields.MOSTLY_LIVE_WHERE}-${childIndex}`;
const getDescribeFieldName = (childIndex: number) => `${formFields.MOSTLY_LIVE_DESCRIBE_ARRANGEMENT}-${childIndex}`;

// Helper to safely get a trimmed string from request body
const safeString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  return undefined;
};

const mostlyLiveRoutes = (router: Router) => {
  router.get(paths.LIVING_VISITING_MOSTLY_LIVE, checkFormProgressFromConfig(FORM_STEPS.LIVING_VISITING_MOSTLY_LIVE), (request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting');
    const existingAnswers = livingAndVisiting?.mostlyLive;

    // Build form values from existing session data
    const formValues: Record<string, string> = {};

    if (existingAnswers) {
      // Handle both old format (direct answer) and new PerChildAnswer format
      if (existingAnswers.default?.where) {
        formValues[getFieldName(0)] = existingAnswers.default.where;
        if (existingAnswers.default.describeArrangement) {
          formValues[getDescribeFieldName(0)] = existingAnswers.default.describeArrangement;
        }
      } else if (existingAnswers.where) {
        // Legacy format - direct answer without default wrapper
        formValues[getFieldName(0)] = existingAnswers.where;
        if (existingAnswers.describeArrangement) {
          formValues[getDescribeFieldName(0)] = existingAnswers.describeArrangement;
        }
      }
    }

    // Merge with flash values
    const flashValues = request.flash('formValues')?.[0] || {};

    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;

    response.render('pages/livingAndVisiting/mostlyLive', {
      errors: request.flash('errors'),
      title: isD2 ? `Where will ${activeChildName} mostly live?` : request.__('livingAndVisiting.mostlyLive.title'),
      values: request.session,
      formValues: { ...formValues, ...flashValues },
      backLinkHref: getBackUrl(request.session, paths.TASK_LIST),
      numberOfChildren,
      namesOfChildren,
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      showDesign3Option: numberOfChildren > 1 && isDesign3(request.session) && isPerChildPoCEnabled(request.session),
    });
  });

  router.post(
    paths.LIVING_VISITING_MOSTLY_LIVE,
    (request, response, next) => {
      const { numberOfChildren } = request.session;

      // Dynamic validation based on submitted fields
      const validations: ReturnType<typeof body>[] = [];

      // Always validate the default/first answer
      validations.push(
        body(getFieldName(0))
          .exists()
          .withMessage((_value, { req }) => req.__('livingAndVisiting.mostlyLive.emptyError'))
      );

      validations.push(
        body(getDescribeFieldName(0))
          .if(body(getFieldName(0)).equals('other'))
          .trim()
          .notEmpty()
          .withMessage((_value, { req }) => req.__('livingAndVisiting.mostlyLive.arrangementMissingError'))
      );

      // Check for per-child entries and validate them
      for (let i = 1; i <= numberOfChildren; i++) {
        const fieldName = getFieldName(i);
        const describeFieldName = getDescribeFieldName(i);
        // Only validate if the field exists in the request
        if (request.body[fieldName] !== undefined && request.body[fieldName] !== '') {
          validations.push(
            body(describeFieldName)
              .if(body(fieldName).equals('other'))
              .trim()
              .notEmpty()
              .withMessage((_value, { req }) => req.__('livingAndVisiting.mostlyLive.arrangementMissingError'))
          );
        }
      }

      // Run all validations
      Promise.all(validations.map(validation => validation.run(request)))
        .then(() => next())
        .catch(next);
    },
    (request, response) => {
      // Design 3: handle "specify per child" - switch to per-child (Design 2) mode
      if (isDesign3(request.session) && request.body['specify-per-child'] === 'yes') {
        request.session.perChildDesignMode = 'design2' as any;
        request.session.currentChildIndex = 0;
        if (!request.session.childPlans || request.session.childPlans.length === 0) {
          request.session.childPlans = (request.session.namesOfChildren || []).map((name: string, index: number) => ({
            childIndex: index,
            childName: name,
            isComplete: false,
          }));
        }
        return response.redirect(paths.LIVING_VISITING_MOSTLY_LIVE);
      }

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        request.flash('formValues', request.body);
        return response.redirect(paths.LIVING_VISITING_MOSTLY_LIVE);
      }

      // Process the default answer
      const defaultWhere = request.body[getFieldName(0)] as whereMostlyLive;
      const defaultDescribe = safeString(request.body[getDescribeFieldName(0)]);

      const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting') || {};

      // Check if we need to clear downstream answers (when default answer changes)
      const currentMostlyLive = livingAndVisiting?.mostlyLive;
      const currentDefaultWhere = currentMostlyLive?.default?.where || currentMostlyLive?.where;
      const shouldClearDownstream = defaultWhere !== currentDefaultWhere;

      const newMostlyLive = {
        default: {
          where: defaultWhere,
          describeArrangement: defaultWhere === 'other' ? defaultDescribe : undefined,
        },
      };

      setSessionSection(request.session, 'livingAndVisiting', {
        mostlyLive: newMostlyLive,
        // Clear downstream if default answer changed
        ...(shouldClearDownstream ? {} : {
          whichSchedule: livingAndVisiting?.whichSchedule,
          overnightVisits: livingAndVisiting?.overnightVisits,
          daytimeVisits: livingAndVisiting?.daytimeVisits,
        }),
      });

      addCompletedStep(request, FORM_STEPS.LIVING_VISITING_MOSTLY_LIVE);

      if (isDesign2(request.session)) {
        if (request.body['apply-to-all'] === 'yes') {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < request.session.numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childLAV = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
              setSessionSection(request.session, 'livingAndVisiting', { ...childLAV, mostlyLive: newMostlyLive });
            }
          }
          request.session.currentChildIndex = 0;
          // Route based on child 0's answer
          const child0LAV = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
          const child0Where = child0LAV?.mostlyLive?.default?.where || child0LAV?.mostlyLive?.where;
          if (child0Where === 'split') {
            return response.redirect(paths.LIVING_VISITING_WHICH_SCHEDULE);
          }
          return response.redirect(paths.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN);
        }
        const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
        if (nextChildIndex < request.session.numberOfChildren) {
          request.session.currentChildIndex = nextChildIndex;
          return response.redirect(paths.LIVING_VISITING_MOSTLY_LIVE);
        }
        request.session.currentChildIndex = 0;
        // All children answered — route based on child 0's answer
        const child0LAV = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
        const child0Where = child0LAV?.mostlyLive?.default?.where || child0LAV?.mostlyLive?.where;
        if (child0Where === 'split') {
          return response.redirect(paths.LIVING_VISITING_WHICH_SCHEDULE);
        }
        return response.redirect(paths.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN);
      }

      switch (defaultWhere) {
        case 'other':
          return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
        case 'split':
          return response.redirect(paths.LIVING_VISITING_WHICH_SCHEDULE);
        default:
          return response.redirect(paths.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN);
      }
    },
  );
};

export default mostlyLiveRoutes;
