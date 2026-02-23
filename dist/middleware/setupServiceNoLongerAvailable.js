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
var setupServiceNoLongerAvailable_exports = {};
__export(setupServiceNoLongerAvailable_exports, {
  default: () => setupServiceNoLongerAvailable_default
});
module.exports = __toCommonJS(setupServiceNoLongerAvailable_exports);
var import_express = require("express");
var import_config = __toESM(require("../config"));
const setupServiceNoLongerAvailable = () => {
  const router = (0, import_express.Router)();
  router.use("*", (request, response, next) => {
    if (/* @__PURE__ */ new Date() < import_config.default.previewEnd) {
      return next();
    }
    response.render("pages/serviceNoLongerAvailable", {
      title: "The private view of this service is now finished"
    });
  });
  return router;
};
var setupServiceNoLongerAvailable_default = setupServiceNoLongerAvailable;
//# sourceMappingURL=setupServiceNoLongerAvailable.js.map
