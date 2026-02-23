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
var setUpStaticResources_exports = {};
__export(setUpStaticResources_exports, {
  default: () => setUpStaticResources_default
});
module.exports = __toCommonJS(setUpStaticResources_exports);
var import_path = __toESM(require("path"));
var import_compression = __toESM(require("compression"));
var import_express = require("express");
var import_nocache = __toESM(require("nocache"));
var import_config = __toESM(require("../config"));
const setUpStaticResources = () => {
  const router = (0, import_express.Router)();
  router.use((0, import_compression.default)());
  const staticResourcesConfig = { maxAge: import_config.default.staticResourceCacheDuration, redirect: false };
  Array.of("/dist/assets", "/node_modules/govuk-frontend/dist/govuk/assets").forEach((dir) => {
    router.use("/assets", (0, import_express.static)(import_path.default.join(process.cwd(), dir), staticResourcesConfig));
  });
  router.use((0, import_nocache.default)());
  return router;
};
var setUpStaticResources_default = setUpStaticResources;
//# sourceMappingURL=setUpStaticResources.js.map
