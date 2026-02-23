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
var doWhatsBest_exports = {};
__export(doWhatsBest_exports, {
  default: () => doWhatsBest_default
});
module.exports = __toCommonJS(doWhatsBest_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../constants/formFields"));
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../utils/addCompletedStep"));
var import_sessionHelpers = require("../utils/sessionHelpers");
const doWhatsBestRoutes = (router) => {
  router.get(import_paths.default.DO_WHATS_BEST, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.DO_WHATS_BEST), (request, response) => {
    response.render("pages/doWhatsBest", {
      errors: request.flash("errors"),
      title: request.__("doWhatsBest.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.CHILDREN_SAFETY_CHECK)
    });
  });
  router.post(
    import_paths.default.DO_WHATS_BEST,
    (0, import_express_validator.body)(import_formFields.default.DO_WHATS_BEST).exists().withMessage((_value, { req }) => req.__("doWhatsBest.error")),
    (request, response) => {
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        return response.redirect(import_paths.default.DO_WHATS_BEST);
      }
      (0, import_addCompletedStep.default)(request, import_formSteps.default.DO_WHATS_BEST);
      return response.redirect(import_paths.default.COURT_ORDER_CHECK);
    }
  );
};
var doWhatsBest_default = doWhatsBestRoutes;
//# sourceMappingURL=doWhatsBest.js.map
