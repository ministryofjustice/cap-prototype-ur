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
var cookies_exports = {};
__export(cookies_exports, {
  default: () => cookies_default
});
module.exports = __toCommonJS(cookies_exports);
var import_config = __toESM(require("../config"));
var import_cookieNames = __toESM(require("../constants/cookieNames"));
var import_formFields = __toESM(require("../constants/formFields"));
var import_paths = __toESM(require("../constants/paths"));
var import_logger = __toESM(require("../logging/logger"));
var import_sessionHelpers = require("../utils/sessionHelpers");
const cookiesRoutes = (router) => {
  router.get(import_paths.default.COOKIES, (request, response) => {
    response.render("pages/cookies", {
      title: request.__("cookies.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.START)
    });
  });
  router.post(import_paths.default.COOKIES, (request, response) => {
    import_logger.default.info(`Accepted analytics. POST ${import_paths.default.COOKIES}`);
    const acceptAnalytics = request.body[import_formFields.default.ACCEPT_OPTIONAL_COOKIES];
    response.cookie(import_cookieNames.default.ANALYTICS_CONSENT, JSON.stringify({ acceptAnalytics }), {
      maxAge: 1e3 * 60 * 60 * 24 * 365,
      // One Year
      secure: import_config.default.useHttps,
      httpOnly: false,
      sameSite: "lax"
    });
    if (acceptAnalytics === "No") {
      const domain = request.hostname;
      response.clearCookie("_ga", { domain, secure: false, httpOnly: false });
      response.clearCookie(`_ga_${import_config.default.analytics.ga4Id.replace("G-", "")}`, {
        domain,
        secure: false,
        httpOnly: false
      });
    }
    return response.redirect(import_paths.default.COOKIES);
  });
};
var cookies_default = cookiesRoutes;
//# sourceMappingURL=cookies.js.map
