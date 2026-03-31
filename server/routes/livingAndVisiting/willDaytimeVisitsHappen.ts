/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { body, matchedData, validationResult } from 'express-validator';

import { yesOrNo } from '../../@types/fields';
import formFields from '../../constants/formFields';
import FORM_STEPS from '../../constants/formSteps';
import paths from '../../constants/paths';
import checkFormProgressFromConfig  from '../../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../../utils/addCompletedStep';
import { convertBooleanValueToRadioButtonValue } from '../../utils/formValueUtils';
import { isDesign2, getSessionValue, setSessionSection } from '../../utils/perChildSession';
import { parentNotMostlyLivedWith, getBackUrl, getRedirectUrlAfterFormSubmit } from '../../utils/sessionHelpers';

const willDaytimeVisitsHappenRoutes = (router: Router) => {
  router.get(paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN, checkFormProgressFromConfig(FORM_STEPS.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN), (request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting');

    response.render('pages/livingAndVisiting/willDaytimeVisitsHappen', {
      errors: request.flash('errors'),
      title: isD2
        ? `Will there be daytime visits for ${activeChildName}?`
        : request.__('livingAndVisiting.willDaytimeVisitsHappen.title', {
            adult: parentNotMostlyLivedWith(request.session),
          }),
      backLinkHref: getBackUrl(request.session, paths.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN),
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      formValues: {
        [formFields.WILL_DAYTIME_VISITS_HAPPEN]: convertBooleanValueToRadioButtonValue(
          livingAndVisiting?.daytimeVisits?.willHappen,
        ),
      },
    });
  });

  router.post(
    paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN,
    body(formFields.WILL_DAYTIME_VISITS_HAPPEN)
      .exists()
      .withMessage((_value, { req }) => req.__('livingAndVisiting.willDaytimeVisitsHappen.error')),
    (request, response) => {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        return response.redirect(paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
      }

      const formData = matchedData<{
        [formFields.WILL_DAYTIME_VISITS_HAPPEN]: yesOrNo;
      }>(request);

      const willDaytimeVisitsHappen = formData[formFields.WILL_DAYTIME_VISITS_HAPPEN] === 'Yes';

      const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
      if (livingAndVisiting?.daytimeVisits?.willHappen !== willDaytimeVisitsHappen) {
        setSessionSection(request.session, 'livingAndVisiting', {
          ...livingAndVisiting,
          daytimeVisits: {
            willHappen: willDaytimeVisitsHappen,
          },
        });
      }

      addCompletedStep(request, FORM_STEPS.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);

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
                daytimeVisits: { willHappen: willDaytimeVisitsHappen },
              });
            }
          }
          request.session.currentChildIndex = 0;
        } else {
          const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
          if (nextChildIndex < numberOfChildren) {
            request.session.currentChildIndex = nextChildIndex;
            return response.redirect(paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
          }
          request.session.currentChildIndex = 0;
        }
        // After all children — check if any child said yes to daytime visits
        const anyDaytime = request.session.childPlans?.some(
          (plan: any) => plan.livingAndVisiting?.daytimeVisits?.willHappen === true,
        );
        if (anyDaytime) {
          return response.redirect(paths.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);
        }
        return response.redirect(paths.TASK_LIST);
      }

      if (willDaytimeVisitsHappen) {
        return response.redirect(paths.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);
      }

      return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
    },
  );
};

export default willDaytimeVisitsHappenRoutes;
