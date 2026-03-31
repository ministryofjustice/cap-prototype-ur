/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { body, matchedData, validationResult } from 'express-validator';

import formFields from '../../constants/formFields';
import FORM_STEPS from '../../constants/formSteps';
import paths from '../../constants/paths';
import checkFormProgressFromConfig  from '../../middleware/checkFormProgressFromConfig';
import addCompletedStep from '../../utils/addCompletedStep';
import { isDesign2, getSessionValue, setSessionSection } from '../../utils/perChildSession';
import { getBackUrl, getRedirectUrlAfterFormSubmit } from '../../utils/sessionHelpers';

const itemsForChangeoverRoutes = (router: Router) => {
  router.get(paths.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER, checkFormProgressFromConfig(FORM_STEPS.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER), (request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const handoverAndHolidays = getSessionValue<any>(request.session, 'handoverAndHolidays');

    response.render('pages/handoverAndHolidays/itemsForChangeover', {
      errors: request.flash('errors'),
      title: isD2
        ? `What items need to go between households for ${activeChildName}?`
        : request.__('handoverAndHolidays.itemsForChangeover.title'),
      initialItemsForChangeover: handoverAndHolidays?.itemsForChangeover?.answer,
      backLinkHref: getBackUrl(request.session, paths.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS),
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
    });
  });

  router.post(
    paths.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER,
    body(formFields.ITEMS_FOR_CHANGEOVER)
      .trim()
      .notEmpty()
      .withMessage((_value, { req }) => req.__('handoverAndHolidays.itemsForChangeover.error')),
    (request, response) => {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        return response.redirect(paths.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER);
      }

      const { [formFields.ITEMS_FOR_CHANGEOVER]: whatWillHappen } = matchedData<{
        [formFields.ITEMS_FOR_CHANGEOVER]: string;
      }>(request, { onlyValidData: false });

      const itemsValue = { noDecisionRequired: false, answer: whatWillHappen };

      const handoverAndHolidays = getSessionValue<any>(request.session, 'handoverAndHolidays') || {};
      setSessionSection(request.session, 'handoverAndHolidays', {
        ...handoverAndHolidays,
        itemsForChangeover: itemsValue,
      });

      addCompletedStep(request, FORM_STEPS.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER);

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
                itemsForChangeover: itemsValue,
              });
            }
          }
          request.session.currentChildIndex = 0;
        } else {
          const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
          if (nextChildIndex < numberOfChildren) {
            request.session.currentChildIndex = nextChildIndex;
            return response.redirect(paths.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER);
          }
          request.session.currentChildIndex = 0;
        }
        return response.redirect(paths.TASK_LIST);
      }

      return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
    },
  );

  router.post(paths.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER_NOT_REQUIRED, (request, response) => {
    const handoverAndHolidays = getSessionValue<any>(request.session, 'handoverAndHolidays') || {};
    setSessionSection(request.session, 'handoverAndHolidays', {
      ...handoverAndHolidays,
      itemsForChangeover: {
        noDecisionRequired: true,
      },
    });

    addCompletedStep(request, FORM_STEPS.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER);

    return response.redirect(getRedirectUrlAfterFormSubmit(request.session, paths.TASK_LIST));
  });
};

export default itemsForChangeoverRoutes;
