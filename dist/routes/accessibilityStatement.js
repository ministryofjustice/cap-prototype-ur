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
var accessibilityStatement_exports = {};
__export(accessibilityStatement_exports, {
  default: () => accessibilityStatement_default
});
module.exports = __toCommonJS(accessibilityStatement_exports);
var import_paths = __toESM(require("../constants/paths"));
var import_sessionHelpers = require("../utils/sessionHelpers");
const accessibilityStatementRoutes = (router) => {
  router.get(import_paths.default.ACCESSIBILITY_STATEMENT, (request, response) => {
    response.render("pages/accessibilityStatement", {
      title: request.__("accessibilityStatement.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.START)
    });
  });
};
var accessibilityStatement_default = accessibilityStatementRoutes;
//# sourceMappingURL=accessibilityStatement.js.map
