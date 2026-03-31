/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import formFields from '../../constants/formFields';
import FORM_STEPS from '../../constants/formSteps';
import paths from '../../constants/paths';
import checkFormProgressFromConfig  from '../../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../../utils/addCompletedStep';
import { isDesign2, isDesign3, isPerChildPoCEnabled, getSessionValue, setSessionSection } from '../../utils/perChildSession';
import { getBackUrl, getRedirectUrlAfterFormSubmit } from '../../utils/sessionHelpers';

// Helper to get the field name for a specific child index
const getFieldName = (childIndex: number) => `${formFields.WHICH_SCHEDULE}-${childIndex}`;

// Helper to safely get a trimmed string from request body
const safeString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
};

const whichScheduleRoutes = (router: Router) => {
  router.get(paths.LIVING_VISITING_WHICH_SCHEDULE, checkFormProgressFromConfig(FORM_STEPS.LIVING_VISITING_WHICH_SCHEDULE), (request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting');
    const existingAnswers = livingAndVisiting?.whichSchedule;

    // Build form values from existing session data
    const formValues: Record<string, string> = {};

    if (existingAnswers) {
      // Handle both old format (direct answer) and new PerChildAnswer format
      if (existingAnswers.default?.answer) {
        formValues[getFieldName(0)] = existingAnswers.default.answer;
      } else if (existingAnswers.answer) {
        // Legacy format - direct answer without default wrapper
        formValues[getFieldName(0)] = existingAnswers.answer;
      }
    }

    // Merge with flash values
    const flashValues = request.flash('formValues')?.[0] || {};

    response.render('pages/livingAndVisiting/whichSchedule', {
      errors: request.flash('errors'),
      title: isD2 ? `What is ${activeChildName}'s schedule?` : request.__('livingAndVisiting.whichSchedule.title'),
      formValues: { ...formValues, ...flashValues },
      backLinkHref: getBackUrl(request.session, paths.LIVING_VISITING_MOSTLY_LIVE),
      numberOfChildren,
      namesOfChildren,
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      showDesign3Option: numberOfChildren > 1 && isDesign3(request.session) && isPerChildPoCEnabled(request.session),
    });
  });

  router.post(
    paths.LIVING_VISITING_WHICH_SCHEDULE,
    (request, response, next) => {
      const { numberOfChildren } = request.session;

      // Dynamic validation based on submitted fields
      const validations: ReturnType<typeof body>[] = [];

      // Always validate the default/first answer
      validations.push(
        body(getFieldName(0))
          .trim()
          .notEmpty()
          .withMessage((_value, { req }) => req.__('livingAndVisiting.whichSchedule.error'))
      );

      // Check for per-child entries and validate them
      for (let i = 1; i <= numberOfChildren; i++) {
        const fieldName = getFieldName(i);
        // Only validate if the field exists in the request
        if (request.body[fieldName] !== undefined && request.body[fieldName] !== '') {
          validations.push(
            body(fieldName)
              .trim()
              .notEmpty()
              .withMessage((_value, { req }) => req.__('livingAndVisiting.whichSchedule.error'))
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
        return response.redirect(paths.LIVING_VISITING_WHICH_SCHEDULE);
      }

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        request.flash('formValues', request.body);
        return response.redirect(paths.LIVING_VISITING_WHICH_SCHEDULE);
      }

      // Process the default answer
      const defaultAnswer = safeString(request.body[getFieldName(0)]);

      const newWhichSchedule = {
        default: {
          noDecisionRequired: false,
          answer: defaultAnswer,
        },
      };

      const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
      setSessionSection(request.session, 'livingAndVisiting', { ...livingAndVisiting, whichSchedule: newWhichSchedule });
      addCompletedStep(request, FORM_STEPS.LIVING_VISITING_WHICH_SCHEDULE);

      if (isDesign2(request.session)) {
        if (request.body['apply-to-all'] === 'yes') {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < request.session.numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childLAV = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
              setSessionSection(request.session, 'livingAndVisiting', { ...childLAV, whichSchedule: newWhichSchedule });
            }
          }
          request.session.currentChildIndex = 0;
          return response.redirect(paths.TASK_LIST);
        }
        const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
        if (nextChildIndex < request.session.numberOfChildren) {
          request.session.currentChildIndex = nextChildIndex;
          return response.redirect(paths.LIVING_VISITING_WHICH_SCHEDULE);
        }
        request.session.currentChildIndex = 0;
        return response.redirect(paths.TASK_LIST);
      }

      return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
    },
  );

  router.post(paths.LIVING_VISITING_WHICH_SCHEDULE_NOT_REQUIRED, (request, response) => {
    const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
    setSessionSection(request.session, 'livingAndVisiting', {
      ...livingAndVisiting,
      whichSchedule: {
        default: {
          noDecisionRequired: true,
        },
      },
    });
    addCompletedStep(request, FORM_STEPS.LIVING_VISITING_WHICH_SCHEDULE);

    return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
  });
};

export default whichScheduleRoutes;
