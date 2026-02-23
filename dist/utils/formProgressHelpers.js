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
var formProgressHelpers_exports = {};
__export(formProgressHelpers_exports, {
  getFlashMessage: () => getFlashMessage,
  getRedirectPath: () => getRedirectPath,
  hasCompletedRequiredSteps: () => hasCompletedRequiredSteps,
  hasUserStartedJourney: () => hasUserStartedJourney
});
module.exports = __toCommonJS(formProgressHelpers_exports);
var import_flowConfig = __toESM(require("../config/flowConfig"));
function hasCompletedRequiredSteps(completedSteps, requiredSteps) {
  return requiredSteps.every((step) => completedSteps.includes(step));
}
function hasUserStartedJourney(completedSteps, pageHistory) {
  return completedSteps.length > 0 || pageHistory.length > 1;
}
function getRedirectPath(missing, startPage) {
  if (missing.length > 0) {
    return import_flowConfig.default[missing[0]]?.path || startPage;
  }
  return startPage;
}
function getFlashMessage(hasVisitedMissingPage) {
  if (hasVisitedMissingPage) {
    return "Your progress was not saved. Please submit this page to continue.";
  }
  return "You need to complete this page before continuing.";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFlashMessage,
  getRedirectPath,
  hasCompletedRequiredSteps,
  hasUserStartedJourney
});
//# sourceMappingURL=formProgressHelpers.js.map
