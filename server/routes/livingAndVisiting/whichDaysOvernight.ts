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
import { getBackUrl } from '../../utils/sessionHelpers';

const whichDaysOvernightRoutes = (router: Router) => {
  router.get(paths.LIVING_VISITING_WHICH_DAYS_OVERNIGHT, checkFormProgressFromConfig(FORM_STEPS.LIVING_VISITING_WHICH_DAYS_OVERNIGHT),(request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    const isD2 = isDesign2(request.session);
    const activeChildIndex = isD2 ? (request.session.currentChildIndex ?? 0) : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting');
    const overnightVisits = livingAndVisiting?.overnightVisits;

    const [previousDaysOvernight, previousDescribeArrangement] = convertWhichDaysSessionValueToField(
      overnightVisits?.whichDays,
    );

    const formValues = {
      [formFields.WHICH_DAYS_OVERNIGHT]: previousDaysOvernight,
      [formFields.WHICH_DAYS_OVERNIGHT_DESCRIBE_ARRANGEMENT]: previousDescribeArrangement,
      ...request.flash('formValues')?.[0],
    };

    response.render('pages/livingAndVisiting/whichDaysOvernight', {
      errors: request.flash('errors'),
      formValues,
      title: isD2
        ? `Which days will ${activeChildName} have overnight visits?`
        : request.__('livingAndVisiting.whichDaysOvernight.title'),
      backLinkHref: getBackUrl(request.session, paths.LIVING_VISITING_MOSTLY_LIVE),
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
    });
  });

  router.post(
    paths.LIVING_VISITING_WHICH_DAYS_OVERNIGHT,
    body(formFields.WHICH_DAYS_OVERNIGHT_DESCRIBE_ARRANGEMENT)
      .if(body(formFields.WHICH_DAYS_OVERNIGHT).equals('other'))
      .trim()
      .notEmpty()
      .withMessage((_value, { req }) => req.__('livingAndVisiting.whichDaysOvernight.arrangementMissingError')),
    body(formFields.WHICH_DAYS_OVERNIGHT)
      .exists()
      .toArray()
      .withMessage((_value, { req }) => req.__('livingAndVisiting.whichDaysOvernight.emptyError')),
    body(formFields.WHICH_DAYS_OVERNIGHT)
      .custom(
        // This is prevented by JS in the page, but possible for people with JS disabled to submit
        (whichDaysOvernight: whichDaysField) =>
          !(whichDaysOvernight.length > 1 && whichDaysOvernight.includes('other')),
      )
      .withMessage((_value, { req }) => req.__('livingAndVisiting.whichDaysOvernight.multiSelectedError')),
    (request, response) => {
      const formData = matchedData<{
        [formFields.WHICH_DAYS_OVERNIGHT_DESCRIBE_ARRANGEMENT]: string;
        [formFields.WHICH_DAYS_OVERNIGHT]: whichDaysField;
      }>(request, { onlyValidData: false });

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.flash('errors', errors.array());
        request.flash('formValues', formData);
        return response.redirect(paths.LIVING_VISITING_WHICH_DAYS_OVERNIGHT);
      }

      const {
        [formFields.WHICH_DAYS_OVERNIGHT]: whichDaysOvernight,
        [formFields.WHICH_DAYS_OVERNIGHT_DESCRIBE_ARRANGEMENT]: describeArrangement,
      } = formData;

      const whichDaysValue = convertWhichDaysFieldToSessionValue(whichDaysOvernight, describeArrangement);

      const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
      setSessionSection(request.session, 'livingAndVisiting', {
        ...livingAndVisiting,
        overnightVisits: {
          ...livingAndVisiting.overnightVisits,
          whichDays: whichDaysValue,
        },
      });

      addCompletedStep(request, FORM_STEPS.LIVING_VISITING_WHICH_DAYS_OVERNIGHT);

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
                overnightVisits: { ...childLAV.overnightVisits, whichDays: whichDaysValue },
              });
            }
          }
          request.session.currentChildIndex = 0;
        } else {
          const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
          if (nextChildIndex < numberOfChildren) {
            request.session.currentChildIndex = nextChildIndex;
            return response.redirect(paths.LIVING_VISITING_WHICH_DAYS_OVERNIGHT);
          }
          request.session.currentChildIndex = 0;
        }
        return response.redirect(paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
      }

      return response.redirect(paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
    },
  );

  router.post(paths.LIVING_VISITING_WHICH_DAYS_OVERNIGHT_NOT_REQUIRED, (request, response) => {
    const livingAndVisiting = getSessionValue<any>(request.session, 'livingAndVisiting') || {};
    setSessionSection(request.session, 'livingAndVisiting', {
      ...livingAndVisiting,
      overnightVisits: {
        willHappen: true,
        whichDays: {
          noDecisionRequired: true,
        },
      },
    });

    addCompletedStep(request, FORM_STEPS.LIVING_VISITING_WHICH_DAYS_OVERNIGHT);

    return response.redirect(paths.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
  });
};

export default whichDaysOvernightRoutes;
