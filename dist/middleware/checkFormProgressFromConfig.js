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
var checkFormProgressFromConfig_exports = {};
__export(checkFormProgressFromConfig_exports, {
  default: () => checkFormProgressFromConfig_default
});
module.exports = __toCommonJS(checkFormProgressFromConfig_exports);
var import_http_errors = __toESM(require("http-errors"));
var import_flowConfig = __toESM(require("../config/flowConfig"));
var import_logger = __toESM(require("../logging/logger"));
var import_formProgressHelpers = require("../utils/formProgressHelpers");
function checkFormProgressFromConfig(currentStepKey) {
  const startPage = import_flowConfig.default.step1?.path ?? "/";
  const stepConfig = import_flowConfig.default[currentStepKey];
  if (!stepConfig) {
    import_logger.default.error(`ERROR: Step '${String(currentStepKey)}' not found in TASK_FLOW_MAP.`);
    throw (0, import_http_errors.default)(404);
  }
  const requiredSteps = stepConfig.dependsOn || [];
  return (req, res, next) => {
    const completedSteps = req.session?.completedSteps || [];
    const pageHistory = req.session?.pageHistory || [];
    const hasRequired = (0, import_formProgressHelpers.hasCompletedRequiredSteps)(completedSteps, requiredSteps);
    if (hasRequired) {
      return next();
    }
    if (!(0, import_formProgressHelpers.hasUserStartedJourney)(completedSteps, pageHistory)) {
      import_logger.default.info(
        `Access denied to ${req.path} (${String(currentStepKey)}). User hasn't started journey. Redirecting to ${startPage}`
      );
      return res.redirect(startPage);
    }
    const missingSteps = requiredSteps.filter((step) => !completedSteps.includes(step));
    const redirectPath = (0, import_formProgressHelpers.getRedirectPath)(missingSteps, startPage);
    const hasVisitedRedirectPage = pageHistory.includes(redirectPath);
    import_logger.default.info(
      `Access denied to ${req.path} (${String(currentStepKey)}). Missing steps: ${missingSteps.join(", ") || "none (alternative path required)"}. Redirecting to ${redirectPath}. Has visited before: ${hasVisitedRedirectPage}`
    );
    const flashMessage = (0, import_formProgressHelpers.getFlashMessage)(hasVisitedRedirectPage);
    req.flash("info", flashMessage);
    return res.redirect(redirectPath);
  };
}
var checkFormProgressFromConfig_default = checkFormProgressFromConfig;
//# sourceMappingURL=checkFormProgressFromConfig.js.map
