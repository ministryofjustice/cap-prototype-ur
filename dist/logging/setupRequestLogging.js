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
var setupRequestLogging_exports = {};
__export(setupRequestLogging_exports, {
  default: () => setupRequestLogging_default
});
module.exports = __toCommonJS(setupRequestLogging_exports);
var import_express = require("express");
var import_logger = __toESM(require("./logger"));
const setupRequestLogging = () => {
  const router = (0, import_express.Router)();
  router.use("*", (request, response, next) => {
    const start = performance.now();
    import_logger.default.debug(`Received ${request.method} ${request.originalUrl}`);
    response.on("finish", () => {
      const duration = performance.now() - start;
      import_logger.default.debug(
        `Responded to ${request.method} ${request.originalUrl} with ${response.statusCode} in ${duration.toFixed(0)}ms`
      );
    });
    next();
  });
  return router;
};
var setupRequestLogging_default = setupRequestLogging;
//# sourceMappingURL=setupRequestLogging.js.map
