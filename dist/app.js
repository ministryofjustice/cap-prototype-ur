var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_http_errors = __toESM(require("http-errors"));
var import_errorHandler = __toESM(require("./errorHandler"));
var import_logger = __toESM(require("./logging/logger"));
var import_setupPageVisitAnalytics = __toESM(require("./logging/setupPageVisitAnalytics"));
var import_setupRequestLogging = __toESM(require("./logging/setupRequestLogging"));
var import_setupAnalytics = __toESM(require("./middleware/setupAnalytics"));
var import_setupAuthentication = __toESM(require("./middleware/setupAuthentication"));
var import_setUpCsrf = __toESM(require("./middleware/setUpCsrf"));
var import_setupFlashMessages = __toESM(require("./middleware/setupFlashMessages"));
var import_setUpHealthCheck = __toESM(require("./middleware/setUpHealthCheck"));
var import_setupHistory = __toESM(require("./middleware/setupHistory"));
var import_setUpi18n = __toESM(require("./middleware/setUpi18n"));
var import_setupRateLimit = __toESM(require("./middleware/setupRateLimit"));
var import_setupRequestParsing = __toESM(require("./middleware/setupRequestParsing"));
var import_setupRobotsTxt = __toESM(require("./middleware/setupRobotsTxt"));
var import_setUpStaticResources = __toESM(require("./middleware/setUpStaticResources"));
var import_setUpWebSecurity = __toESM(require("./middleware/setUpWebSecurity"));
var import_setUpWebSession = __toESM(require("./middleware/setUpWebSession"));
var import_routes = __toESM(require("./routes"));
var import_unauthenticatedRoutes = __toESM(require("./routes/unauthenticatedRoutes"));
var import_nunjucksSetup = __toESM(require("./utils/nunjucksSetup"));
const createApp = () => {
  const app2 = (0, import_express.default)();
  app2.set("json spaces", 2);
  app2.set("trust proxy", 1);
  app2.set("port", process.env.PORT || 3e3);
  app2.disable("x-powered-by");
  app2.use((0, import_setupRobotsTxt.default)());
  app2.use((0, import_setUpi18n.default)());
  (0, import_nunjucksSetup.default)(app2);
  app2.use((0, import_setUpHealthCheck.default)());
  app2.use((0, import_setUpWebSecurity.default)());
  app2.use((0, import_setupRateLimit.default)());
  app2.use((0, import_setUpWebSession.default)());
  app2.use((0, import_setUpi18n.setUpLocaleFromSession)());
  app2.use((0, import_setupRequestParsing.default)());
  app2.use((0, import_setupPageVisitAnalytics.default)());
  app2.use((0, import_setupRequestLogging.default)());
  app2.use((0, import_setUpStaticResources.default)());
  app2.use((0, import_setUpCsrf.default)());
  app2.use((0, import_setupFlashMessages.default)());
  app2.use((0, import_setupAnalytics.default)());
  app2.use((0, import_setupHistory.default)());
  app2.use((0, import_unauthenticatedRoutes.default)());
  app2.use((0, import_setupAuthentication.default)());
  app2.use((0, import_routes.default)());
  app2.use((_request, _response, next) => next((0, import_http_errors.default)(404)));
  app2.use((0, import_errorHandler.default)());
  return app2;
};
const app = createApp();
app.listen(app.get("port"), () => {
  import_logger.default.info(`Server listening on port ${app.get("port")}`);
});
//# sourceMappingURL=app.js.map
