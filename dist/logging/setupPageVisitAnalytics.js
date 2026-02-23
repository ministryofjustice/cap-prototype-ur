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
var setupPageVisitAnalytics_exports = {};
__export(setupPageVisitAnalytics_exports, {
  default: () => setupPageVisitAnalytics_default
});
module.exports = __toCommonJS(setupPageVisitAnalytics_exports);
var import_on_finished = __toESM(require("on-finished"));
var import_analyticsService = require("../services/analyticsService");
const EXCLUDED_PATHS = ["/health", "/ping", "/manifest.json"];
const EXCLUDED_PATTERNS = [
  /^\/assets/,
  /^\/images/,
  /^\/js/,
  /^\/fonts/,
  /^\/css/,
  /^\/rebrand/,
  /^\/download/
];
const setupPageVisitAnalytics = () => {
  return (req, res, next) => {
    (0, import_on_finished.default)(res, () => {
      const { method, path } = req;
      const { statusCode: responseStatusCode } = res;
      if (method !== "GET" || responseStatusCode >= 400) {
        return;
      }
      if (EXCLUDED_PATHS.includes(path)) {
        return;
      }
      if (EXCLUDED_PATTERNS.some((pattern) => pattern.test(path))) {
        return;
      }
      (0, import_analyticsService.logPageVisit)(req, res);
    });
    next();
  };
};
var setupPageVisitAnalytics_default = setupPageVisitAnalytics;
//# sourceMappingURL=setupPageVisitAnalytics.js.map
