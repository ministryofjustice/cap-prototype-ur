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
var redirectValidator_exports = {};
__export(redirectValidator_exports, {
  sanitizeRedirectUrl: () => sanitizeRedirectUrl,
  validateRedirectUrl: () => validateRedirectUrl
});
module.exports = __toCommonJS(redirectValidator_exports);
var import_paths = __toESM(require("../constants/paths"));
const ALLOWED_REDIRECT_PATHS = new Set(Object.values(import_paths.default));
const validateRedirectUrl = (url, fallbackUrl = import_paths.default.START) => {
  if (!url) {
    return fallbackUrl;
  }
  const trimmedUrl = url.trim();
  if (!trimmedUrl.startsWith("/")) {
    return fallbackUrl;
  }
  if (trimmedUrl.startsWith("//") || trimmedUrl.includes("://")) {
    return fallbackUrl;
  }
  const pathOnly = trimmedUrl.split("?")[0].split("#")[0];
  if (!ALLOWED_REDIRECT_PATHS.has(pathOnly)) {
    return fallbackUrl;
  }
  return trimmedUrl;
};
const sanitizeRedirectUrl = validateRedirectUrl;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sanitizeRedirectUrl,
  validateRedirectUrl
});
//# sourceMappingURL=redirectValidator.js.map
