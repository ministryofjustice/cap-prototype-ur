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
var errorHandler_exports = {};
__export(errorHandler_exports, {
  default: () => createErrorHandler
});
module.exports = __toCommonJS(errorHandler_exports);
var import_config = __toESM(require("./config"));
var import_logger = __toESM(require("./logging/logger"));
const QUIET_404_PATH_PREFIXES = ["/.well-known/appspecific/"];
function shouldQuiet404(request, status) {
  if (status !== 404) return false;
  return QUIET_404_PATH_PREFIXES.some((prefix) => request.originalUrl?.startsWith(prefix));
}
function createErrorHandler() {
  return (error, request, response, _next) => {
    const { production } = import_config.default;
    const status = error.status || 500;
    if (shouldQuiet404(request, status)) {
      import_logger.default.debug(`404 for '${request.originalUrl}' (suppressed)`);
    } else {
      import_logger.default.error(`Error handling request for '${request.originalUrl}'`, error);
    }
    response.locals.status = status;
    response.locals.stack = error.stack;
    response.status(status);
    return status === 404 ? response.render("pages/errors/notFound", { title: request.__("errors.notFound.title") }) : response.render("pages/errors/generic", {
      production,
      title: production ? request.__("errors.generic.title") : error.message
    });
  };
}
//# sourceMappingURL=errorHandler.js.map
