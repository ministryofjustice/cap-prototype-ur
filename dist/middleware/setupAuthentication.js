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
var setupAuthentication_exports = {};
__export(setupAuthentication_exports, {
  default: () => setupAuthentication_default
});
module.exports = __toCommonJS(setupAuthentication_exports);
var import_url = __toESM(require("url"));
var import_express = require("express");
var import_config = __toESM(require("../config"));
var import_cookieNames = __toESM(require("../constants/cookieNames"));
var import_paths = __toESM(require("../constants/paths"));
var import_encryptPassword = __toESM(require("../utils/encryptPassword"));
const setupAuthentication = () => {
  const router = (0, import_express.Router)();
  router.use((req, res, next) => {
    if (!import_config.default.useAuth || isAuthenticated(req)) {
      next();
      return;
    }
    sendUserToPasswordPage(req, res);
  });
  return router;
};
const sendUserToPasswordPage = (req, res) => {
  const passwordPageURL = import_url.default.format({
    pathname: import_paths.default.PASSWORD,
    query: { returnURL: req.originalUrl }
  });
  res.redirect(passwordPageURL);
};
const isAuthenticated = (req) => import_config.default.passwords.map(import_encryptPassword.default).some((p) => p === req.cookies[import_cookieNames.default.AUTHENTICATION]);
var setupAuthentication_default = setupAuthentication;
//# sourceMappingURL=setupAuthentication.js.map
