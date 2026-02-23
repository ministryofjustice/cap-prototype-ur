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
var willDaytimeVisitsHappen_exports = {};
__export(willDaytimeVisitsHappen_exports, {
  default: () => willDaytimeVisitsHappen_default
});
module.exports = __toCommonJS(willDaytimeVisitsHappen_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_formValueUtils = require("../../utils/formValueUtils");
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const willDaytimeVisitsHappenRoutes = (router) => {
  router.get(import_paths.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN), (request, response) => {
    const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
    response.render("pages/livingAndVisiting/willDaytimeVisitsHappen", {
      errors: request.flash("errors"),
      title: request.__("livingAndVisiting.willDaytimeVisitsHappen.title", {
        adult: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session)
      }),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN),
      formValues: {
        [import_formFields.default.WILL_DAYTIME_VISITS_HAPPEN]: (0, import_formValueUtils.convertBooleanValueToRadioButtonValue)(
          livingAndVisiting?.daytimeVisits?.willHappen
        )
      }
    });
  });
  router.post(
    import_paths.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN,
    (0, import_express_validator.body)(import_formFields.default.WILL_DAYTIME_VISITS_HAPPEN).exists().withMessage((_value, { req }) => req.__("livingAndVisiting.willDaytimeVisitsHappen.error")),
    (request, response) => {
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        return response.redirect(import_paths.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
      }
      const formData = (0, import_express_validator.matchedData)(request);
      const willDaytimeVisitsHappen = formData[import_formFields.default.WILL_DAYTIME_VISITS_HAPPEN] === "Yes";
      const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting") || {};
      if (livingAndVisiting?.daytimeVisits?.willHappen !== willDaytimeVisitsHappen) {
        (0, import_perChildSession.setSessionSection)(request.session, "livingAndVisiting", {
          ...livingAndVisiting,
          daytimeVisits: {
            willHappen: willDaytimeVisitsHappen
          }
        });
      }
      if (willDaytimeVisitsHappen) {
        (0, import_addCompletedStep.default)(request, import_formSteps.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
        return response.redirect(import_paths.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS);
      }
      (0, import_addCompletedStep.default)(request, import_formSteps.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
      return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
    }
  );
};
var willDaytimeVisitsHappen_default = willDaytimeVisitsHappenRoutes;
//# sourceMappingURL=willDaytimeVisitsHappen.js.map
