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
var childrenSafetyCheck_exports = {};
__export(childrenSafetyCheck_exports, {
  default: () => childrenSafetyCheck_default
});
module.exports = __toCommonJS(childrenSafetyCheck_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../constants/formFields"));
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../utils/addCompletedStep"));
var import_sessionHelpers = require("../utils/sessionHelpers");
const safetyCheckRoutes = (router) => {
  router.get(import_paths.default.CHILDREN_SAFETY_CHECK, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.CHILDREN_SAFETY_CHECK), (request, response) => {
    response.render("pages/childrenSafetyCheck", {
      errors: request.flash("errors"),
      title: request.__("childrenSafetyCheck.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.SAFETY_CHECK)
    });
  });
  router.get(import_paths.default.CHILDREN_NOT_SAFE, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.CHILDREN_NOT_SAFE), (request, response) => {
    (0, import_addCompletedStep.default)(request, import_formSteps.default.CHILDREN_NOT_SAFE);
    response.render("pages/childrenNotSafe", {
      title: request.__("childrenNotSafe.title"),
      backLinkHref: import_paths.default.CHILDREN_SAFETY_CHECK
    });
  });
  router.post(
    import_paths.default.CHILDREN_SAFETY_CHECK,
    (0, import_express_validator.body)(import_formFields.default.CHILDREN_SAFETY_CHECK).exists().withMessage((_value, { req }) => req.__("childrenSafetyCheck.error")),
    (request, response) => {
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        return response.redirect(import_paths.default.CHILDREN_SAFETY_CHECK);
      }
      const { [import_formFields.default.CHILDREN_SAFETY_CHECK]: isSafe } = (0, import_express_validator.matchedData)(request);
      (0, import_addCompletedStep.default)(request, import_formSteps.default.CHILDREN_SAFETY_CHECK);
      return isSafe === "Yes" ? response.redirect(import_paths.default.DO_WHATS_BEST) : response.redirect(import_paths.default.CHILDREN_NOT_SAFE);
    }
  );
};
var childrenSafetyCheck_default = safetyCheckRoutes;
//# sourceMappingURL=childrenSafetyCheck.js.map
