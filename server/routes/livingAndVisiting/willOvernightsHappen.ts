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
import { parentNotMostlyLivedWith, getBackUrl } from '../../utils/sessionHelpers';

const willOvernightsHappenRoutes = (router: Router) => {
  router.get(paths.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN, checkFormProgressFromConfig(FORM_STEPS.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN), (request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting');

    response.render('pages/livingAndVisiting/willOvernightsHappen', {
      errors: request.flash('errors'),
      title: isD2
        ? `Will there be overnight visits for ${activeChildName}?`
        : request.__('livingAndVisiting.willOvernightsHappen.title', {
            adult: parentNotMostlyLivedWith(request.session),
          }),
      backLinkHref: getBackUrl(request.session, paths.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN),
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      formValues: {
        [formFields.WILL_OVERNIGHTS_HAPPEN]: convertBooleanValueToRadioButtonValue(
          livingAndVisiting?.overnightVisits?.willHappen,
        ),
      },
    });
  });

  router.post(
    paths.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN,
    body(formFields.WILL_OVERNIGHTS_HAPPEN)
      .exists()
      .withMessage((_value, { req }) => req.__('livingAndVisiting.willOvernightsHappen.error')),
    (request, response) => {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        return response.redirect(paths.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN);
      }

      const formData = matchedData<{
        [formFields.WILL_OVERNIGHTS_HAPPEN]: yesOrNo;
      }>(request);

      const willOvernightsHappen = formData[formFields.WILL_OVERNIGHTS_HAPPEN] === 'Yes';

      const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
      if (livingAndVisiting?.overnightVisits?.willHappen !== willOvernightsHappen) {
        setSessionSection(request.session, 'livingAndVisiting', {
          ...livingAndVisiting,
          overnightVisits: {
            willHappen: willOvernightsHappen,
          },
        });
      }

      addCompletedStep(request, FORM_STEPS.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN);

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
                overnightVisits: { willHappen: willOvernightsHappen },
              });
            }
          }
          request.session.currentChildIndex = 0;
        } else {
          const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
          if (nextChildIndex < numberOfChildren) {
            request.session.currentChildIndex = nextChildIndex;
            return response.redirect(paths.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN);
          }
          request.session.currentChildIndex = 0;
        }
        // After all children — check if any child said yes to overnights
        const anyOvernights = request.session.childPlans?.some(
          (plan: any) => plan.livingAndVisiting?.overnightVisits?.willHappen === true,
        );
        if (anyOvernights) {
          return response.redirect(paths.LIVING_VISITING_WHICH_DAYS_OVERNIGHT);
        }
        return response.redirect(paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
      }

      if (willOvernightsHappen) {
        return response.redirect(paths.LIVING_VISITING_WHICH_DAYS_OVERNIGHT);
      }

      return response.redirect(paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
    },
  );
};

export default willOvernightsHappenRoutes;
