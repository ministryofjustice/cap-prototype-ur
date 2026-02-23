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
var setUpWebSecurity_exports = {};
__export(setUpWebSecurity_exports, {
  default: () => setUpWebSecurity_default
});
module.exports = __toCommonJS(setUpWebSecurity_exports);
var import_crypto = __toESM(require("crypto"));
var import_express = require("express");
var import_helmet = __toESM(require("helmet"));
var import_config = __toESM(require("../config"));
const setUpWebSecurity = () => {
  const router = (0, import_express.Router)();
  router.use((_req, response, next) => {
    response.locals.cspNonce = import_crypto.default.randomBytes(16).toString("hex");
    next();
  });
  router.use(
    (0, import_helmet.default)({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // This nonce allows us to use scripts with the use of the `cspNonce` local, e.g (in a Nunjucks template):
          // <script nonce="{{ cspNonce }}">
          // or
          // <link href="http://example.com/" rel="stylesheet" nonce="{{ cspNonce }}">
          // This ensures only scripts we trust are loaded, and not anything injected into the
          // page by an attacker.
          scriptSrc: [
            "'self'",
            (_request, reponse) => `'nonce-${reponse.locals.cspNonce}'`,
            "https://*.googletagmanager.com"
          ],
          imgSrc: ["'self'", "data:", "https://*.google-analytics.com", "https://*.googletagmanager.com"],
          connectSrc: [
            "'self'",
            "https://*.google-analytics.com",
            "https://*.analytics.google.com",
            "https://*.googletagmanager.com"
          ],
          styleSrc: ["'self'", (_req, response) => `'nonce-${response.locals.cspNonce}'`],
          fontSrc: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: import_config.default.useHttps ? [] : null
        }
      },
      crossOriginEmbedderPolicy: true,
      strictTransportSecurity: import_config.default.useHttps
    })
  );
  return router;
};
var setUpWebSecurity_default = setUpWebSecurity;
//# sourceMappingURL=setUpWebSecurity.js.map
