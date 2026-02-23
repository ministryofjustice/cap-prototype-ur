var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var whichDaysDaytimeVisits_exports = {};
__export(whichDaysDaytimeVisits_exports, {
  default: () => whichDaysDaytimeVisits_default
});
module.exports = __toCommonJS(whichDaysDaytimeVisits_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_formValueUtils = require("../../utils/formValueUtils");
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const whichDaysDaytimeVisitsRoutes = (router) => {
  router.get(import_paths.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS), (request, response) => {
    const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
    const daytimeVisits = livingAndVisiting?.daytimeVisits;
    const [previousDays, previousDescribeArrangement] = (0, import_formValueUtils.convertWhichDaysSessionValueToField)(daytimeVisits?.whichDays);
    const formValues = {
      [import_formFields.default.WHICH_DAYS_DAYTIME_VISITS]: previousDays,
      [import_formFields.default.WHICH_DAYS_DAYTIME_VISITS_DESCRIBE_ARRANGEMENT]: previousDescribeArrangement,
      ...request.flash("formValues")?.[0]
    };
    response.render("pages/livingAndVisiting/whichDaysDaytimeVisits", {
      errors: request.flash("errors"),
      formValues,
      title: request.__("livingAndVisiting.whichDaysDaytimeVisits.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN)
    });
  });
  router.post(
    import_paths.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS,
    (0, import_express_validator.body)(import_formFields.default.WHICH_DAYS_DAYTIME_VISITS_DESCRIBE_ARRANGEMENT).if((0, import_express_validator.body)(import_formFields.default.WHICH_DAYS_DAYTIME_VISITS).equals("other")).trim().notEmpty().withMessage((_value, { req }) => req.__("livingAndVisiting.whichDaysDaytimeVisits.arrangementMissingError")),
    (0, import_express_validator.body)(import_formFields.default.WHICH_DAYS_DAYTIME_VISITS).exists().toArray().withMessage((_value, { req }) => req.__("livingAndVisiting.whichDaysDaytimeVisits.emptyError")),
    (0, import_express_validator.body)(import_formFields.default.WHICH_DAYS_DAYTIME_VISITS).custom(
      // This is prevented by JS in the page, but possible for people with JS disabled to submit
      (whichDays) => !(whichDays.length > 1 && whichDays.includes("other"))
    ).withMessage((_value, { req }) => req.__("livingAndVisiting.whichDaysDaytimeVisits.multiSelectedError")),
    (request, response) => {
      const formData = (0, import_express_validator.matchedData)(request, { onlyValidData: false });
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        request.flash("formValues", formData);
        return response.redirect(import_paths.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);
      }
      const {
        [import_formFields.default.WHICH_DAYS_DAYTIME_VISITS]: whichDays,
        [import_formFields.default.WHICH_DAYS_DAYTIME_VISITS_DESCRIBE_ARRANGEMENT]: describeArrangement
      } = formData;
      const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting") || {};
      (0, import_perChildSession.setSessionSection)(request.session, "livingAndVisiting", {
        ...livingAndVisiting,
        daytimeVisits: {
          ...livingAndVisiting.daytimeVisits,
          whichDays: (0, import_formValueUtils.convertWhichDaysFieldToSessionValue)(whichDays, describeArrangement)
        }
      });
      (0, import_addCompletedStep.default)(request, import_formSteps.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);
      return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
    }
  );
  router.post(import_paths.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS_NOT_REQUIRED, (request, response) => {
    const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting") || {};
    (0, import_perChildSession.setSessionSection)(request.session, "livingAndVisiting", {
      ...livingAndVisiting,
      daytimeVisits: {
        willHappen: true,
        whichDays: {
          noDecisionRequired: true
        }
      }
    });
    (0, import_addCompletedStep.default)(request, import_formSteps.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);
    return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
  });
};
var whichDaysDaytimeVisits_default = whichDaysDaytimeVisitsRoutes;
//# sourceMappingURL=whichDaysDaytimeVisits.js.map
