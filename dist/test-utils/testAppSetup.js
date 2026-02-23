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
var testAppSetup_exports = {};
__export(testAppSetup_exports, {
  default: () => testAppSetup_default
});
module.exports = __toCommonJS(testAppSetup_exports);
var import_express = __toESM(require("express"));
var import_http_errors = __toESM(require("http-errors"));
var import_errorHandler = __toESM(require("../errorHandler"));
var import_setupPageVisitAnalytics = __toESM(require("../logging/setupPageVisitAnalytics"));
var import_setupRequestLogging = __toESM(require("../logging/setupRequestLogging"));
var import_setupAnalytics = __toESM(require("../middleware/setupAnalytics"));
var import_setupAuthentication = __toESM(require("../middleware/setupAuthentication"));
var import_setUpHealthCheck = __toESM(require("../middleware/setUpHealthCheck"));
var import_setupHistory = __toESM(require("../middleware/setupHistory"));
var import_setUpi18n = __toESM(require("../middleware/setUpi18n"));
var import_setupRequestParsing = __toESM(require("../middleware/setupRequestParsing"));
var import_setupServiceNoLongerAvailable = __toESM(require("../middleware/setupServiceNoLongerAvailable"));
var import_routes = __toESM(require("../routes"));
var import_unauthenticatedRoutes = __toESM(require("../routes/unauthenticatedRoutes"));
var import_nunjucksSetup = __toESM(require("../utils/nunjucksSetup"));
var import_testMocks = require("./testMocks");
const testAppSetup = () => {
  const app = (0, import_express.default)();
  app.disable("x-powered-by");
  app.use((0, import_setUpi18n.default)());
  (0, import_nunjucksSetup.default)(app);
  app.use((request, _response, next) => {
    request.session = import_testMocks.sessionMock;
    request.flash = import_testMocks.flashMock;
    next();
  });
  app.use((0, import_setUpi18n.setUpLocaleFromSession)());
  app.use((0, import_setUpHealthCheck.default)());
  app.use((0, import_setupRequestParsing.default)());
  app.use((0, import_setupAnalytics.default)());
  app.use((0, import_setupHistory.default)());
  app.use((0, import_setupServiceNoLongerAvailable.default)());
  app.use((0, import_unauthenticatedRoutes.default)());
  app.use((0, import_setupPageVisitAnalytics.default)());
  app.use((0, import_setupRequestLogging.default)());
  app.use((0, import_setupAuthentication.default)());
  app.use((0, import_routes.default)());
  const testRouter = (0, import_express.Router)();
  testRouter.get("/create-error", (_request, _response, next) => {
    next(new Error("An error happened!"));
  });
  app.use(testRouter);
  app.use((_request, _response, next) => next((0, import_http_errors.default)(404)));
  app.use((0, import_errorHandler.default)());
  return app;
};
var testAppSetup_default = testAppSetup;
//# sourceMappingURL=testAppSetup.js.map
