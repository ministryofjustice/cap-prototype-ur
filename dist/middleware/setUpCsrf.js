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
var setUpCsrf_exports = {};
__export(setUpCsrf_exports, {
  default: () => setUpCsrf_default
});
module.exports = __toCommonJS(setUpCsrf_exports);
var import_csrf_sync = require("csrf-sync");
var import_express = require("express");
const testMode = process.env.NODE_ENV === "test";
const setUpCsrf = () => {
  const router = (0, import_express.Router)({ mergeParams: true });
  if (!testMode) {
    const {
      csrfSynchronisedProtection
      // This is the default CSRF protection middleware.
    } = (0, import_csrf_sync.csrfSync)({
      // By default, csrf-sync uses x-csrf-token header, but we use the token in forms and send it in the request body, so change getTokenFromRequest so it grabs from there
      getTokenFromRequest: (req) => {
        return req.body._csrf;
      }
    });
    router.use((req, res, next) => {
      if (req.path.startsWith("/api/analytics/")) {
        return next();
      }
      return csrfSynchronisedProtection(req, res, next);
    });
  }
  router.use((request, response, next) => {
    if (typeof request.csrfToken === "function") {
      response.locals.csrfToken = request.csrfToken();
    }
    next();
  });
  return router;
};
var setUpCsrf_default = setUpCsrf;
//# sourceMappingURL=setUpCsrf.js.map
