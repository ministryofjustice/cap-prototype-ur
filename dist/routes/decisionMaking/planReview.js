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
var planReview_exports = {};
__export(planReview_exports, {
  default: () => planReview_default
});
module.exports = __toCommonJS(planReview_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const planReviewRoutes = (router) => {
  router.get(import_paths.default.DECISION_MAKING_PLAN_REVIEW, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.DECISION_MAKING_PLAN_REVIEW), (request, response) => {
    const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking");
    const planReview = decisionMaking?.planReview;
    const formValues = {
      [import_formFields.default.PLAN_REVIEW_MONTHS]: planReview?.months,
      [import_formFields.default.PLAN_REVIEW_YEARS]: planReview?.years,
      ...request.flash("formValues")?.[0]
    };
    response.render("pages/decisionMaking/planReview", {
      errors: request.flash("errors"),
      formValues,
      title: request.__("decisionMaking.planReview.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE)
    });
  });
  const getMonthYearValidation = (formField, otherFromField) => (0, import_express_validator.body)(formField).trim().custom((value, { req }) => value || req.body[otherFromField]).withMessage((_value, { req }) => req.__("decisionMaking.planReview.bothEmptyError")).bail().custom((value, { req }) => !(value && req.body[otherFromField])).withMessage((_value, { req }) => req.__("decisionMaking.planReview.bothFilledError")).bail().if((0, import_express_validator.body)(otherFromField).isEmpty()).isNumeric().withMessage((_value, { req }) => req.__("decisionMaking.planReview.notNumberError")).bail().if((0, import_express_validator.body)(otherFromField).isEmpty()).isInt({ min: 0 }).withMessage((_value, { req }) => req.__("decisionMaking.planReview.notIntError"));
  router.post(
    import_paths.default.DECISION_MAKING_PLAN_REVIEW,
    getMonthYearValidation(import_formFields.default.PLAN_REVIEW_MONTHS, import_formFields.default.PLAN_REVIEW_YEARS),
    getMonthYearValidation(import_formFields.default.PLAN_REVIEW_YEARS, import_formFields.default.PLAN_REVIEW_MONTHS),
    (request, response) => {
      const formData = (0, import_express_validator.matchedData)(request, { onlyValidData: false });
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        request.flash("formValues", formData);
        return response.redirect(import_paths.default.DECISION_MAKING_PLAN_REVIEW);
      }
      const { [import_formFields.default.PLAN_REVIEW_MONTHS]: months, [import_formFields.default.PLAN_REVIEW_YEARS]: years } = formData;
      const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking") || {};
      (0, import_perChildSession.setSessionSection)(request.session, "decisionMaking", {
        ...decisionMaking,
        planReview: {
          months: months ? parseInt(months) : void 0,
          years: years ? parseInt(years) : void 0
        }
      });
      (0, import_addCompletedStep.default)(request, import_formSteps.default.DECISION_MAKING_PLAN_REVIEW);
      return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
    }
  );
};
var planReview_default = planReviewRoutes;
//# sourceMappingURL=planReview.js.map
