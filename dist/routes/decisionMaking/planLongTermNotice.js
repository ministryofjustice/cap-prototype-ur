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
var planLongTermNotice_exports = {};
__export(planLongTermNotice_exports, {
  default: () => planLongTermNotice_default
});
module.exports = __toCommonJS(planLongTermNotice_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const planLongTermNoticeRoutes = (router) => {
  router.get(import_paths.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE), (request, response) => {
    const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking");
    const planLongTermNotice = decisionMaking?.planLongTermNotice;
    const formValues = {
      [import_formFields.default.PLAN_LONG_TERM_NOTICE]: planLongTermNotice?.weeks ?? (planLongTermNotice?.otherAnswer && "anotherArrangement"),
      [import_formFields.default.PLAN_LONG_TERM_NOTICE_DESCRIBE_ARRANGEMENT]: planLongTermNotice?.otherAnswer,
      ...request.flash("formValues")?.[0]
    };
    response.render("pages/decisionMaking/planLongTermNotice", {
      errors: request.flash("errors"),
      formValues,
      title: request.__("decisionMaking.planLongTermNotice.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.DECISION_MAKING_PLAN_LAST_MINUTE_CHANGES)
    });
  });
  router.post(
    import_paths.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE,
    (0, import_express_validator.body)(import_formFields.default.PLAN_LONG_TERM_NOTICE).notEmpty().withMessage((_value, { req }) => req.__("decisionMaking.planLongTermNotice.selectOneOptionError")),
    (0, import_express_validator.body)(import_formFields.default.PLAN_LONG_TERM_NOTICE_DESCRIBE_ARRANGEMENT).if((0, import_express_validator.body)(import_formFields.default.PLAN_LONG_TERM_NOTICE).equals("anotherArrangement")).trim().notEmpty().withMessage((_value, { req }) => req.__("decisionMaking.planLongTermNotice.descriptionEmptyError")),
    (request, response) => {
      const formData = (0, import_express_validator.matchedData)(request, { onlyValidData: false });
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        request.flash("formValues", formData);
        return response.redirect(import_paths.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE);
      }
      const {
        [import_formFields.default.PLAN_LONG_TERM_NOTICE]: weeks,
        [import_formFields.default.PLAN_LONG_TERM_NOTICE_DESCRIBE_ARRANGEMENT]: describeArrangement
      } = formData;
      const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking") || {};
      (0, import_perChildSession.setSessionSection)(request.session, "decisionMaking", {
        ...decisionMaking,
        planLongTermNotice: {
          noDecisionRequired: false,
          weeks: Number.parseInt(weeks) || void 0,
          otherAnswer: Number.parseInt(weeks) ? void 0 : describeArrangement
        }
      });
      (0, import_addCompletedStep.default)(request, import_formSteps.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE);
      return response.redirect(import_paths.default.DECISION_MAKING_PLAN_REVIEW);
    }
  );
  router.post(import_paths.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE_CHANGES_NOT_REQUIRED, (request, response) => {
    const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking") || {};
    (0, import_perChildSession.setSessionSection)(request.session, "decisionMaking", {
      ...decisionMaking,
      planLongTermNotice: {
        noDecisionRequired: true
      }
    });
    (0, import_addCompletedStep.default)(request, import_formSteps.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE);
    return response.redirect(import_paths.default.DECISION_MAKING_PLAN_REVIEW);
  });
};
var planLongTermNotice_default = planLongTermNoticeRoutes;
//# sourceMappingURL=planLongTermNotice.js.map
