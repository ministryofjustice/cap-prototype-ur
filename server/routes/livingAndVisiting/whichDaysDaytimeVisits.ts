/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { body, matchedData, validationResult } from 'express-validator';

import { whichDaysField } from '../../@types/fields';
import formFields from '../../constants/formFields';
import FORM_STEPS from '../../constants/formSteps';
import paths from '../../constants/paths';
import checkFormProgressFromConfig  from '../../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../../utils/addCompletedStep';
import { convertWhichDaysFieldToSessionValue, convertWhichDaysSessionValueToField } from '../../utils/formValueUtils';
import { isDesign2, getSessionValue, setSessionSection } from '../../utils/perChildSession';
import { getBackUrl, getRedirectUrlAfterFormSubmit } from '../../utils/sessionHelpers';

const whichDaysDaytimeVisitsRoutes = (router: Router) => {
  router.get(paths.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS, checkFormProgressFromConfig(FORM_STEPS.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS), (request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting');
    const daytimeVisits = livingAndVisiting?.daytimeVisits;

    const [previousDays, previousDescribeArrangement] = convertWhichDaysSessionValueToField(daytimeVisits?.whichDays);

    const formValues = {
      [formFields.WHICH_DAYS_DAYTIME_VISITS]: previousDays,
      [formFields.WHICH_DAYS_DAYTIME_VISITS_DESCRIBE_ARRANGEMENT]: previousDescribeArrangement,
      ...request.flash('formValues')?.[0],
    };

    response.render('pages/livingAndVisiting/whichDaysDaytimeVisits', {
      errors: request.flash('errors'),
      formValues,
      title: isD2
        ? `Which days will ${activeChildName} have daytime visits?`
        : request.__('livingAndVisiting.whichDaysDaytimeVisits.title'),
      backLinkHref: getBackUrl(request.session, paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN),
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
    });
  });

  router.post(
    paths.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS,
    body(formFields.WHICH_DAYS_DAYTIME_VISITS_DESCRIBE_ARRANGEMENT)
      .if(body(formFields.WHICH_DAYS_DAYTIME_VISITS).equals('other'))
      .trim()
      .notEmpty()
      .withMessage((_value, { req }) => req.__('livingAndVisiting.whichDaysDaytimeVisits.arrangementMissingError')),
    body(formFields.WHICH_DAYS_DAYTIME_VISITS)
      .exists()
      .toArray()
      .withMessage((_value, { req }) => req.__('livingAndVisiting.whichDaysDaytimeVisits.emptyError')),
    body(formFields.WHICH_DAYS_DAYTIME_VISITS)
      .custom(
        // This is prevented by JS in the page, but possible for people with JS disabled to submit
        (whichDays: whichDaysField) => !(whichDays.length > 1 && whichDays.includes('other')),
      )
      .withMessage((_value, { req }) => req.__('livingAndVisiting.whichDaysDaytimeVisits.multiSelectedError')),
    (request, response) => {
      const formData = matchedData<{
        [formFields.WHICH_DAYS_DAYTIME_VISITS_DESCRIBE_ARRANGEMENT]: string;
        [formFields.WHICH_DAYS_DAYTIME_VISITS]: whichDaysField;
      }>(request, { onlyValidData: false });

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        request.flash('formValues', formData);
        return response.redirect(paths.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);
      }

      const {
        [formFields.WHICH_DAYS_DAYTIME_VISITS]: whichDays,
        [formFields.WHICH_DAYS_DAYTIME_VISITS_DESCRIBE_ARRANGEMENT]: describeArrangement,
      } = formData;

      const whichDaysValue = convertWhichDaysFieldToSessionValue(whichDays, describeArrangement);

      const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
      setSessionSection(request.session, 'livingAndVisiting', {
        ...livingAndVisiting,
        daytimeVisits: {
          ...livingAndVisiting.daytimeVisits,
          whichDays: whichDaysValue,
        },
      });

      addCompletedStep(request, FORM_STEPS.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);

      if (isDesign2(request.session)) {
        const { numberOfChildren } = request.session;
        if (request.body['apply-to-all'] === 'yes') {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childLAV = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
              setSessionSection(request.session, 'livingAndVisiting', {
                ...childLAV,
                daytimeVisits: { ...childLAV.daytimeVisits, whichDays: whichDaysValue },
              });
            }
          }
          request.session.currentChildIndex = 0;
        } else {
          const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
          if (nextChildIndex < numberOfChildren) {
            request.session.currentChildIndex = nextChildIndex;
            return response.redirect(paths.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);
          }
          request.session.currentChildIndex = 0;
        }
        return response.redirect(paths.TASK_LIST);
      }

      return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
    },
  );

  router.post(paths.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS_NOT_REQUIRED, (request, response) => {
    const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
    setSessionSection(request.session, 'livingAndVisiting', {
      ...livingAndVisiting,
      daytimeVisits: {
        willHappen: true,
        whichDays: {
          noDecisionRequired: true,
        },
      },
    });

    addCompletedStep(request, FORM_STEPS.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);

    return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
  });
};

export default whichDaysDaytimeVisitsRoutes;
