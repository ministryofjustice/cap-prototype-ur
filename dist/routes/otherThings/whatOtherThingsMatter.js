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
var whatOtherThingsMatter_exports = {};
__export(whatOtherThingsMatter_exports, {
  default: () => whatOtherThingsMatter_default
});
module.exports = __toCommonJS(whatOtherThingsMatter_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const whatOtherThingsMatterRoutes = (router) => {
  router.get(import_paths.default.OTHER_THINGS_WHAT_OTHER_THINGS_MATTER, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.OTHER_THINGS_WHAT_OTHER_THINGS_MATTER), (request, response) => {
    const otherThings = (0, import_perChildSession.getSessionValue)(request.session, "otherThings");
    response.render("pages/otherThings/whatOtherThingsMatter", {
      errors: request.flash("errors"),
      title: request.__("otherThings.whatOtherThingsMatter.title"),
      initialWhatOtherThingsMatter: otherThings?.whatOtherThingsMatter?.answer,
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.TASK_LIST)
    });
  });
  router.post(
    import_paths.default.OTHER_THINGS_WHAT_OTHER_THINGS_MATTER,
    (0, import_express_validator.body)(import_formFields.default.WHAT_OTHER_THINGS_MATTER).trim().notEmpty().withMessage((_value, { req }) => req.__("otherThings.whatOtherThingsMatter.error")),
    (request, response) => {
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        return response.redirect(import_paths.default.OTHER_THINGS_WHAT_OTHER_THINGS_MATTER);
      }
      const { [import_formFields.default.WHAT_OTHER_THINGS_MATTER]: whatOtherThingsMatter } = (0, import_express_validator.matchedData)(request, { onlyValidData: false });
      const otherThings = (0, import_perChildSession.getSessionValue)(request.session, "otherThings") || {};
      (0, import_perChildSession.setSessionSection)(request.session, "otherThings", {
        ...otherThings,
        whatOtherThingsMatter: {
          noDecisionRequired: false,
          answer: whatOtherThingsMatter
        }
      });
      (0, import_addCompletedStep.default)(request, import_formSteps.default.OTHER_THINGS_WHAT_OTHER_THINGS_MATTER);
      return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
    }
  );
  router.post(import_paths.default.OTHER_THINGS_WHAT_OTHER_THINGS_MATTER_NOT_REQUIRED, (request, response) => {
    const otherThings = (0, import_perChildSession.getSessionValue)(request.session, "otherThings") || {};
    (0, import_perChildSession.setSessionSection)(request.session, "otherThings", {
      ...otherThings,
      whatOtherThingsMatter: {
        noDecisionRequired: true
      }
    });
    (0, import_addCompletedStep.default)(request, import_formSteps.default.OTHER_THINGS_WHAT_OTHER_THINGS_MATTER);
    return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
  });
};
var whatOtherThingsMatter_default = whatOtherThingsMatterRoutes;
//# sourceMappingURL=whatOtherThingsMatter.js.map
