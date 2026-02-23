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
var setUpi18n_exports = {};
__export(setUpi18n_exports, {
  default: () => setUpi18n_default,
  setUpLocaleFromSession: () => setUpLocaleFromSession
});
module.exports = __toCommonJS(setUpi18n_exports);
var import_path = __toESM(require("path"));
var import_express = require("express");
var import_i18n = __toESM(require("i18n"));
var import_config = __toESM(require("../config"));
const setUpi18n = () => {
  const router = (0, import_express.Router)();
  const { includeWelshLanguage } = import_config.default;
  import_i18n.default.configure({
    defaultLocale: "en",
    locales: includeWelshLanguage ? ["en", "cy"] : ["en"],
    queryParameter: "lang",
    cookie: "lang",
    directory: import_path.default.resolve(__dirname, "../locales"),
    updateFiles: false,
    retryInDefaultLocale: true,
    objectNotation: true
  });
  router.use(import_i18n.default.init);
  return router;
};
const setUpLocaleFromSession = () => {
  const router = (0, import_express.Router)();
  router.use((req, res, next) => {
    const lang = req.query.lang;
    if (lang && import_i18n.default.getLocales().includes(lang)) {
      req.session.lang = lang;
      res.setLocale(lang);
    } else if (req.session?.lang) {
      res.setLocale(req.session.lang);
    }
    next();
  });
  return router;
};
var setUpi18n_default = setUpi18n;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  setUpLocaleFromSession
});
//# sourceMappingURL=setUpi18n.js.map
