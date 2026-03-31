import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import { getBetweenHouseholdsField } from '../../@types/fields';
import { CAPSession } from '../../@types/session';
import formFields from '../../constants/formFields';
import FORM_STEPS from '../../constants/formSteps';
import paths from '../../constants/paths';
import checkFormProgressFromConfig  from '../../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../../utils/addCompletedStep';
import { isDesign2, isDesign3, isPerChildPoCEnabled, getSessionValue, setSessionSection } from '../../utils/perChildSession';
import { getBackUrl } from '../../utils/sessionHelpers';

// Helper to get the field name for a specific child index
const getFieldName = (childIndex: number) => `${formFields.GET_BETWEEN_HOUSEHOLDS}-${childIndex}`;

// Helper to get the describe arrangement field name for a specific child index
const getDescribeArrangementFieldName = (childIndex: number) => `${formFields.GET_BETWEEN_HOUSEHOLDS_DESCRIBE_ARRANGEMENT}-${childIndex}`;

// Helper to safely get a trimmed string from request body
const safeString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
};

const getBetweenHouseholdsRoutes = (router: Router) => {
  router.get(paths.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS, checkFormProgressFromConfig(FORM_STEPS.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS), (request, response) => {
    const { numberOfChildren, namesOfChildren, handoverAndHolidays } = request.session;
    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const sessionHandoverAndHolidays = isD2 ? getSessionValue<CAPSession['handoverAndHolidays']>(request.session, 'handoverAndHolidays') : handoverAndHolidays;
    const existingAnswers = sessionHandoverAndHolidays?.getBetweenHouseholds;

    // Build form values from existing session data
    const formValues: Record<string, string> = {};

    if (existingAnswers) {
      // Set the default answer
      if (existingAnswers.default?.how) {
        formValues[getFieldName(0)] = existingAnswers.default.how;
      }
      if (existingAnswers.default?.describeArrangement) {
        formValues[getDescribeArrangementFieldName(0)] = existingAnswers.default.describeArrangement;
      }
    }

    response.render('pages/handoverAndHolidays/getBetweenHouseholds', {
      errors: request.flash('errors'),
      formValues: { ...formValues, ...request.flash('formValues')?.[0] },
      title: isD2 ? `How will ${activeChildName} get between the two households?` : request.__('handoverAndHolidays.getBetweenHouseholds.title'),
      values: request.session,
      backLinkHref: getBackUrl(request.session, paths.TASK_LIST),
      numberOfChildren,
      namesOfChildren,
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      showDesign3Option: numberOfChildren > 1 && isDesign3(request.session) && isPerChildPoCEnabled(request.session),
    });
  });

  router.post(
    paths.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS,
    (request, response, next) => {
      const { numberOfChildren } = request.session;

      // Dynamic validation based on submitted fields
      const validations: ReturnType<typeof body>[] = [];

      // Always validate the default/first answer
      validations.push(
        body(getFieldName(0))
          .exists()
          .withMessage((_value, { req }) => req.__('handoverAndHolidays.getBetweenHouseholds.emptyError'))
      );

      // Validate the describe arrangement field if "other" is selected for default
      validations.push(
        body(getDescribeArrangementFieldName(0))
          .if(body(getFieldName(0)).equals('other'))
          .trim()
          .notEmpty()
          .withMessage((_value, { req }) => req.__('handoverAndHolidays.getBetweenHouseholds.arrangementMissingError'))
      );

      // Check for per-child entries and validate them
      for (let i = 1; i <= numberOfChildren; i++) {
        const fieldName = getFieldName(i);
        const describeFieldName = getDescribeArrangementFieldName(i);

        // Only validate if the field exists in the request
        if (request.body[fieldName] !== undefined && request.body[fieldName] !== '') {
          validations.push(
            body(fieldName)
              .exists()
              .withMessage((_value, { req }) => req.__('handoverAndHolidays.getBetweenHouseholds.emptyError'))
          );

          // Validate the describe arrangement field if "other" is selected for this child
          validations.push(
            body(describeFieldName)
              .if(body(fieldName).equals('other'))
              .trim()
              .notEmpty()
              .withMessage((_value, { req }) => req.__('handoverAndHolidays.getBetweenHouseholds.arrangementMissingError'))
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
        return response.redirect(paths.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);
      }

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        request.flash('formValues', request.body);
        return response.redirect(paths.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);
      }

      // Process the default answer
      const defaultHow = safeString(request.body[getFieldName(0)]);
      const defaultDescribeArrangement = safeString(request.body[getDescribeArrangementFieldName(0)]);

      const { numberOfChildren } = request.session;

      const currentHandoverAndHolidays = isDesign2(request.session)
        ? (getSessionValue<CAPSession['handoverAndHolidays']>(request.session, 'handoverAndHolidays') || {})
        : (request.session.handoverAndHolidays || {});

      const newHAH = {
        ...currentHandoverAndHolidays,
        getBetweenHouseholds: {
          default: {
            noDecisionRequired: false,
            how: defaultHow as getBetweenHouseholdsField,
            describeArrangement: defaultHow === 'other' ? defaultDescribeArrangement : undefined,
          },
        },
      };

      if (isDesign2(request.session)) {
        setSessionSection(request.session, 'handoverAndHolidays', newHAH);
      } else {
        request.session.handoverAndHolidays = newHAH;
      }

      addCompletedStep(request, FORM_STEPS.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);

      if (isDesign2(request.session)) {
        if (request.body['apply-to-all'] === 'yes') {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childHAH = getSessionValue<CAPSession['handoverAndHolidays']>(request.session, 'handoverAndHolidays') || {};
              setSessionSection(request.session, 'handoverAndHolidays', { ...childHAH, getBetweenHouseholds: newHAH.getBetweenHouseholds });
            }
          }
          request.session.currentChildIndex = 0;
          return response.redirect(paths.TASK_LIST);
        }
        const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
        if (nextChildIndex < numberOfChildren) {
          request.session.currentChildIndex = nextChildIndex;
          return response.redirect(paths.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);
        }
        request.session.currentChildIndex = 0;
        return response.redirect(paths.TASK_LIST);
      }

      return response.redirect(paths.HANDOVER_HOLIDAYS_WHERE_HANDOVER);
    },
  );

  router.post(paths.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS_NOT_REQUIRED, (request, response) => {
    request.session.handoverAndHolidays = {
      ...request.session.handoverAndHolidays,
      getBetweenHouseholds: {
        default: {
          noDecisionRequired: true,
        },
      },
    };

    addCompletedStep(request, FORM_STEPS.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);

    return response.redirect(paths.HANDOVER_HOLIDAYS_WHERE_HANDOVER);
  });
};

export default getBetweenHouseholdsRoutes;
