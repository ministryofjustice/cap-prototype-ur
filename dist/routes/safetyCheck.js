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
var safetyCheck_exports = {};
__export(safetyCheck_exports, {
  default: () => safetyCheck_default
});
module.exports = __toCommonJS(safetyCheck_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../constants/formFields"));
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../utils/addCompletedStep"));
const safetyCheckRoutes = (router) => {
  router.get(import_paths.default.SAFETY_CHECK, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.SAFETY_CHECK), (request, response) => {
    response.render("pages/safetyCheck", {
      errors: request.flash("errors"),
      title: request.__("safetyCheck.title")
    });
  });
  router.get(import_paths.default.NOT_SAFE, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.NOT_SAFE), (request, response) => {
    (0, import_addCompletedStep.default)(request, import_formSteps.default.NOT_SAFE);
    response.render("pages/notSafe", {
      title: request.__("notSafe.title"),
      backLinkHref: import_paths.default.SAFETY_CHECK
    });
  });
  router.post(
    import_paths.default.SAFETY_CHECK,
    (0, import_express_validator.body)(import_formFields.default.SAFETY_CHECK).exists().withMessage((_value, { req }) => req.__("safetyCheck.error")),
    (request, response) => {
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        return response.redirect(import_paths.default.SAFETY_CHECK);
      }
      const { [import_formFields.default.SAFETY_CHECK]: isSafe } = (0, import_express_validator.matchedData)(request);
      (0, import_addCompletedStep.default)(request, import_formSteps.default.SAFETY_CHECK);
      return isSafe === "Yes" ? response.redirect(import_paths.default.CHILDREN_SAFETY_CHECK) : response.redirect(import_paths.default.NOT_SAFE);
    }
  );
};
var safetyCheck_default = safetyCheckRoutes;
//# sourceMappingURL=safetyCheck.js.map
