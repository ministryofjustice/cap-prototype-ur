var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var analytics_exports = {};
__export(analytics_exports, {
  default: () => analytics_default
});
module.exports = __toCommonJS(analytics_exports);
var import_analyticsService = require("../services/analyticsService");
function skipSessionSave(req, _res, next) {
  if (req.session) {
    req.session.save = (cb) => {
      if (cb) cb();
      return req.session;
    };
  }
  next();
}
const analyticsRoutes = (router) => {
  router.use("/api/analytics", skipSessionSave);
  router.post("/api/analytics/link-click", (request, response) => {
    const { url, linkText, linkType, currentPage } = request.body;
    if (!url || typeof url !== "string") {
      return response.status(400).json({ error: "Invalid request: url is required" });
    }
    (0, import_analyticsService.logLinkClick)(request, url, linkText, linkType, currentPage);
    response.status(204).send();
  });
  router.post("/api/analytics/page-exit", (request, response) => {
    const { exitPage, destinationUrl } = request.body;
    if (!exitPage || typeof exitPage !== "string") {
      return response.status(400).json({ error: "Invalid request: exitPage is required" });
    }
    (0, import_analyticsService.logPageExit)(request, exitPage, destinationUrl);
    response.status(204).send();
  });
  router.post("/api/analytics/quick-exit", (request, response) => {
    const { exitPage } = request.body;
    if (!exitPage || typeof exitPage !== "string") {
      return response.status(400).json({ error: "Invalid request: exitPage is required" });
    }
    (0, import_analyticsService.logQuickExit)(request, exitPage);
    response.status(204).send();
  });
};
var analytics_default = analyticsRoutes;
//# sourceMappingURL=analytics.js.map
