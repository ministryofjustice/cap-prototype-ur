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
var willChangeDuringSchoolHolidays_exports = {};
__export(willChangeDuringSchoolHolidays_exports, {
  default: () => willChangeDuringSchoolHolidays_default
});
module.exports = __toCommonJS(willChangeDuringSchoolHolidays_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_formValueUtils = require("../../utils/formValueUtils");
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const willChangeDuringSchoolHolidaysRoutes = (router) => {
  router.get(import_paths.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS), (request, response) => {
    const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays");
    response.render("pages/handoverAndHolidays/willChangeDuringSchoolHolidays", {
      errors: request.flash("errors"),
      title: request.__("handoverAndHolidays.willChangeDuringSchoolHolidays.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER),
      formValues: {
        [import_formFields.default.WILL_CHANGE_DURING_SCHOOL_HOLIDAYS]: (0, import_formValueUtils.convertBooleanValueToRadioButtonValue)(
          handoverAndHolidays?.willChangeDuringSchoolHolidays?.willChange
        )
      }
    });
  });
  router.post(
    import_paths.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS,
    (0, import_express_validator.body)(import_formFields.default.WILL_CHANGE_DURING_SCHOOL_HOLIDAYS).exists().withMessage((_value, { req }) => req.__("handoverAndHolidays.willChangeDuringSchoolHolidays.error")),
    (request, response) => {
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);
      }
      const formData = (0, import_express_validator.matchedData)(request);
      const willArrangementsChange = formData[import_formFields.default.WILL_CHANGE_DURING_SCHOOL_HOLIDAYS] === "Yes";
      const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays") || {};
      (0, import_perChildSession.setSessionSection)(request.session, "handoverAndHolidays", {
        ...handoverAndHolidays,
        willChangeDuringSchoolHolidays: {
          noDecisionRequired: false,
          willChange: willArrangementsChange
        }
      });
      if (willArrangementsChange) {
        (0, import_addCompletedStep.default)(request, import_formSteps.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);
        return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_HOW_CHANGE_DURING_SCHOOL_HOLIDAYS);
      }
      const updatedHandoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays") || {};
      delete updatedHandoverAndHolidays.howChangeDuringSchoolHolidays;
      (0, import_perChildSession.setSessionSection)(request.session, "handoverAndHolidays", updatedHandoverAndHolidays);
      (0, import_addCompletedStep.default)(request, import_formSteps.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);
      return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER);
    }
  );
  router.post(import_paths.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS_NOT_REQUIRED, (request, response) => {
    const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays") || {};
    delete handoverAndHolidays.howChangeDuringSchoolHolidays;
    (0, import_perChildSession.setSessionSection)(request.session, "handoverAndHolidays", {
      ...handoverAndHolidays,
      willChangeDuringSchoolHolidays: {
        noDecisionRequired: true
      }
    });
    (0, import_addCompletedStep.default)(request, import_formSteps.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);
    return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER);
  });
};
var willChangeDuringSchoolHolidays_default = willChangeDuringSchoolHolidaysRoutes;
//# sourceMappingURL=willChangeDuringSchoolHolidays.js.map
