import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import { CAPSession } from '../../@types/session';
import formFields from '../../constants/formFields';
import FORM_STEPS from '../../constants/formSteps';
import paths from '../../constants/paths';
import checkFormProgressFromConfig  from '../../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../../utils/addCompletedStep';
import { isDesign2, isDesign3, isPerChildPoCEnabled, getSessionValue, setSessionSection } from '../../utils/perChildSession';
import { getBackUrl, getRedirectUrlAfterFormSubmit } from '../../utils/sessionHelpers';

// Helper to get the field name for a specific child index
const getFieldName = (childIndex: number) => `${formFields.SPECIAL_DAYS}-${childIndex}`;

// Helper to safely get a trimmed string from request body
const safeString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
};

const whatWillHappenRoutes = (router: Router) => {
  router.get(paths.SPECIAL_DAYS_WHAT_WILL_HAPPEN, checkFormProgressFromConfig(FORM_STEPS.SPECIAL_DAYS_WHAT_WILL_HAPPEN), (request, response) => {
    const { numberOfChildren, namesOfChildren, specialDays } = request.session;
    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const sessionSpecialDays = isD2 ? getSessionValue<CAPSession['specialDays']>(request.session, 'specialDays') : specialDays;
    const existingAnswers = sessionSpecialDays?.whatWillHappen;

    // Build form values from existing session data
    const formValues: Record<string, string> = {};

    if (existingAnswers) {
      // Set the default answer
      if (existingAnswers.default?.answer) {
        formValues[getFieldName(0)] = existingAnswers.default.answer;
      }
    }

    response.render('pages/specialDays/whatWillHappen', {
      errors: request.flash('errors'),
      formValues: { ...formValues, ...request.flash('formValues')?.[0] },
      title: isD2 ? `What will happen for ${activeChildName} on special days?` : request.__('specialDays.whatWillHappen.title'),
      backLinkHref: getBackUrl(request.session, paths.TASK_LIST),
      numberOfChildren,
      namesOfChildren,
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      showDesign3Option: numberOfChildren > 1 && isDesign3(request.session) && isPerChildPoCEnabled(request.session),
    });
  });

  router.post(
    paths.SPECIAL_DAYS_WHAT_WILL_HAPPEN,
    (request, response, next) => {
      const { numberOfChildren } = request.session;

      // Dynamic validation based on submitted fields
      const validations: ReturnType<typeof body>[] = [];

      // Always validate the default/first answer
      validations.push(
        body(getFieldName(0))
          .trim()
          .notEmpty()
          .withMessage((_value, { req }) => req.__('specialDays.whatWillHappen.error'))
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
              .withMessage((_value, { req }) => req.__('specialDays.whatWillHappen.error'))
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
        request.session.perChildDesignMode = 'design2';
        request.session.currentChildIndex = 0;
        if (!request.session.childPlans || request.session.childPlans.length === 0) {
          request.session.childPlans = (request.session.namesOfChildren || []).map((name: string, index: number) => ({
            childIndex: index,
            childName: name,
            isComplete: false,
          }));
        }
        return response.redirect(paths.SPECIAL_DAYS_WHAT_WILL_HAPPEN);
      }

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        request.flash('formValues', request.body);
        return response.redirect(paths.SPECIAL_DAYS_WHAT_WILL_HAPPEN);
      }

      // Process the default answer
      const defaultAnswer = safeString(request.body[getFieldName(0)]);

      const { numberOfChildren } = request.session;

      const newWhatWillHappen = {
        default: {
          noDecisionRequired: false,
          answer: defaultAnswer,
        },
      };

      if (isDesign2(request.session)) {
        const currentSpecialDays = getSessionValue<CAPSession['specialDays']>(request.session, 'specialDays') || {};
        setSessionSection(request.session, 'specialDays', { ...currentSpecialDays, whatWillHappen: newWhatWillHappen });
      } else {
        request.session.specialDays = {
          ...request.session.specialDays,
          whatWillHappen: newWhatWillHappen,
        };
      }

      addCompletedStep(request, FORM_STEPS.SPECIAL_DAYS_WHAT_WILL_HAPPEN);

      if (isDesign2(request.session)) {
        if (request.body['apply-to-all'] === 'yes') {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childSpecialDays = getSessionValue<CAPSession['specialDays']>(request.session, 'specialDays') || {};
              setSessionSection(request.session, 'specialDays', { ...childSpecialDays, whatWillHappen: newWhatWillHappen });
            }
          }
          request.session.currentChildIndex = 0;
          return response.redirect(paths.TASK_LIST);
        }
        const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
        if (nextChildIndex < numberOfChildren) {
          request.session.currentChildIndex = nextChildIndex;
          return response.redirect(paths.SPECIAL_DAYS_WHAT_WILL_HAPPEN);
        }
        request.session.currentChildIndex = 0;
        return response.redirect(paths.TASK_LIST);
      }

      return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
    },
  );

  router.post(paths.SPECIAL_DAYS_WHAT_WILL_HAPPEN_NOT_REQUIRED, (request, response) => {
    request.session.specialDays = {
      ...request.session.specialDays,
      whatWillHappen: {
        default: {
          noDecisionRequired: true,
        },
      },
    };

    addCompletedStep(request, FORM_STEPS.SPECIAL_DAYS_WHAT_WILL_HAPPEN);

    return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
  });
};

export default whatWillHappenRoutes;
