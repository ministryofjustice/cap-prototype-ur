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
var unauthenticatedRoutes_exports = {};
__export(unauthenticatedRoutes_exports, {
  default: () => unauthenticatedRoutes_default
});
module.exports = __toCommonJS(unauthenticatedRoutes_exports);
var import_express = require("express");
var import_accessibilityStatement = __toESM(require("./accessibilityStatement"));
var import_contactUs = __toESM(require("./contactUs"));
var import_cookies = __toESM(require("./cookies"));
var import_password = __toESM(require("./password"));
var import_privacyNotice = __toESM(require("./privacyNotice"));
var import_termsAndConditions = __toESM(require("./termsAndConditions"));
const routes = () => {
  const router = (0, import_express.Router)();
  (0, import_password.default)(router);
  (0, import_cookies.default)(router);
  (0, import_accessibilityStatement.default)(router);
  (0, import_contactUs.default)(router);
  (0, import_privacyNotice.default)(router);
  (0, import_termsAndConditions.default)(router);
  return router;
};
var unauthenticatedRoutes_default = routes;
//# sourceMappingURL=unauthenticatedRoutes.js.map
