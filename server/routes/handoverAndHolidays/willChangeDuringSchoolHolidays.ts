/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { body, matchedData, validationResult } from 'express-validator';

import { yesOrNo } from '../../@types/fields';
import formFields from '../../constants/formFields';
import FORM_STEPS from '../../constants/formSteps';
import paths from '../../constants/paths';
import checkFormProgressFromConfig from '../../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../../utils/addCompletedStep';
import { convertBooleanValueToRadioButtonValue } from '../../utils/formValueUtils';
import { isDesign2, getSessionValue, setSessionSection } from '../../utils/perChildSession';
import { getBackUrl } from '../../utils/sessionHelpers';

const willChangeDuringSchoolHolidaysRoutes = (router: Router) => {
  router.get(paths.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS, checkFormProgressFromConfig(FORM_STEPS.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS), (request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const handoverAndHolidays = getSessionValue<any>(request.session, 'handoverAndHolidays');

    response.render('pages/handoverAndHolidays/willChangeDuringSchoolHolidays', {
      errors: request.flash('errors'),
      title: isD2
        ? `Will arrangements change during school holidays for ${activeChildName}?`
        : request.__('handoverAndHolidays.willChangeDuringSchoolHolidays.title'),
      backLinkHref: getBackUrl(request.session, paths.HANDOVER_HOLIDAYS_WHERE_HANDOVER),
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      formValues: {
        [formFields.WILL_CHANGE_DURING_SCHOOL_HOLIDAYS]: convertBooleanValueToRadioButtonValue(
          handoverAndHolidays?.willChangeDuringSchoolHolidays?.willChange,
        ),
      },
    });
  });

  router.post(
    paths.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS,
    body(formFields.WILL_CHANGE_DURING_SCHOOL_HOLIDAYS)
      .exists()
      .withMessage((_value, { req }) => req.__('handoverAndHolidays.willChangeDuringSchoolHolidays.error')),
    (request, response) => {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        return response.redirect(paths.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);
      }

      const formData = matchedData<{
        [formFields.WILL_CHANGE_DURING_SCHOOL_HOLIDAYS]: yesOrNo;
      }>(request);

      const willArrangementsChange = formData[formFields.WILL_CHANGE_DURING_SCHOOL_HOLIDAYS] === 'Yes';

      const newWillChange = {
        noDecisionRequired: false,
        willChange: willArrangementsChange,
      };

      const handoverAndHolidays = getSessionValue<any>(request.session, 'handoverAndHolidays') || {};
      setSessionSection(request.session, 'handoverAndHolidays', {
        ...handoverAndHolidays,
        willChangeDuringSchoolHolidays: newWillChange,
      });

      addCompletedStep(request, FORM_STEPS.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);

      if (isDesign2(request.session)) {
        const { numberOfChildren } = request.session;
        if (request.body['apply-to-all'] === 'yes') {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childHAH = getSessionValue<any>(request.session, 'handoverAndHolidays') || {};
              setSessionSection(request.session, 'handoverAndHolidays', {
                ...childHAH,
                willChangeDuringSchoolHolidays: newWillChange,
              });
            }
          }
          request.session.currentChildIndex = 0;
        } else {
          const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
          if (nextChildIndex < numberOfChildren) {
            request.session.currentChildIndex = nextChildIndex;
            return response.redirect(paths.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);
          }
          request.session.currentChildIndex = 0;
        }
        // After all children — check if any child said willChange is true
        const anyWillChange = request.session.childPlans?.some(
          (plan: any) => plan.handoverAndHolidays?.willChangeDuringSchoolHolidays?.willChange === true,
        );
        if (anyWillChange) {
          return response.redirect(paths.HANDOVER_HOLIDAYS_HOW_CHANGE_DURING_SCHOOL_HOLIDAYS);
        }
        return response.redirect(paths.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER);
      }

      if (willArrangementsChange) {
        return response.redirect(paths.HANDOVER_HOLIDAYS_HOW_CHANGE_DURING_SCHOOL_HOLIDAYS);
      }

      const updatedHandoverAndHolidays = getSessionValue<any>(request.session, 'handoverAndHolidays') || {};
      delete updatedHandoverAndHolidays.howChangeDuringSchoolHolidays;
      setSessionSection(request.session, 'handoverAndHolidays', updatedHandoverAndHolidays);

      return response.redirect(paths.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER);
    },
  );

  router.post(paths.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS_NOT_REQUIRED, (request, response) => {
    const handoverAndHolidays = getSessionValue<any>(request.session, 'handoverAndHolidays') || {};
    delete handoverAndHolidays.howChangeDuringSchoolHolidays;
    setSessionSection(request.session, 'handoverAndHolidays', {
      ...handoverAndHolidays,
      willChangeDuringSchoolHolidays: {
        noDecisionRequired: true,
      },
    });

    addCompletedStep(request, FORM_STEPS.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);

    return response.redirect(paths.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER);
  });
};

export default willChangeDuringSchoolHolidaysRoutes;
