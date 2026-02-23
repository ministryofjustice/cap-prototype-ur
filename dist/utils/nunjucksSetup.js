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
var nunjucksSetup_exports = {};
__export(nunjucksSetup_exports, {
  default: () => nunjucksSetup_default
});
module.exports = __toCommonJS(nunjucksSetup_exports);
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_i18n = __toESM(require("i18n"));
var import_nunjucks = require("nunjucks");
var import_config = __toESM(require("../config"));
var import_cookieNames = __toESM(require("../constants/cookieNames"));
var import_formFields = __toESM(require("../constants/formFields"));
var import_paths = __toESM(require("../constants/paths"));
var import_logger = __toESM(require("../logging/logger"));
var import_getAssetPath = __toESM(require("./getAssetPath"));
var import_errorSummaryList = __toESM(require("./nunjucksHelpers/errorSummaryList"));
var import_findError = __toESM(require("./nunjucksHelpers/findError"));
var import_urlize = __toESM(require("./nunjucksHelpers/urlize"));
const nunjucksSetup = (app) => {
  app.set("view engine", "njk");
  let assetManifest = {};
  try {
    const assetMetadataPath = (0, import_getAssetPath.default)("manifest.json");
    assetManifest = JSON.parse(import_fs.default.readFileSync(assetMetadataPath, "utf8"));
  } catch (e) {
    if (process.env.NODE_ENV !== "test") {
      import_logger.default.error(e, "Could not read asset manifest file");
    }
  }
  const njkEnv = (0, import_nunjucks.configure)([import_path.default.join(__dirname, "../views"), "node_modules/govuk-frontend/dist/"], {
    autoescape: true,
    express: app
  });
  njkEnv.addFilter("assetMap", (url) => assetManifest[url] || url);
  njkEnv.addGlobal("feedbackUrl", import_config.default.feedbackUrl);
  njkEnv.addGlobal("contactEmail", import_config.default.contactEmail);
  njkEnv.addGlobal(
    "previewEnd",
    import_config.default.previewEnd.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
  );
  njkEnv.addGlobal("paths", import_paths.default);
  njkEnv.addGlobal("formFields", import_formFields.default);
  njkEnv.addGlobal("cookieNames", import_cookieNames.default);
  njkEnv.addGlobal("__", import_i18n.default.__);
  njkEnv.addGlobal("getLocale", () => import_i18n.default.getLocale);
  njkEnv.addFilter("findError", import_findError.default);
  njkEnv.addFilter("errorSummaryList", import_errorSummaryList.default);
  njkEnv.addFilter("customUrlize", import_urlize.default);
};
var nunjucksSetup_default = nunjucksSetup;
//# sourceMappingURL=nunjucksSetup.js.map
