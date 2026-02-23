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
var setupHistory_exports = {};
__export(setupHistory_exports, {
  default: () => setupHistory_default
});
module.exports = __toCommonJS(setupHistory_exports);
var import_express = require("express");
var import_paths = __toESM(require("../constants/paths"));
const pathsNotForHistory = [
  // These pdf pages should not be in the history, as they are not navigated to
  import_paths.default.DOWNLOAD_PDF,
  import_paths.default.PRINT_PDF,
  import_paths.default.DOWNLOAD_PAPER_FORM,
  // These pages should be skipped in the back button
  import_paths.default.PASSWORD,
  import_paths.default.ACCESSIBILITY_STATEMENT,
  import_paths.default.CONTACT_US,
  import_paths.default.COOKIES,
  import_paths.default.PRIVACY_NOTICE,
  import_paths.default.TERMS_AND_CONDITIONS,
  import_paths.default.EXISTING_COURT_ORDER
];
const pathsForHistory = Object.values(import_paths.default).filter((path) => !pathsNotForHistory.includes(path));
const setupHistory = () => {
  const router = (0, import_express.Router)();
  router.get("*", (request, response, next) => {
    const requestUrl = request.originalUrl;
    const isTrackedPath = pathsForHistory.includes(requestUrl);
    response.on("finish", () => {
      const history = request.session.pageHistory || [import_paths.default.START];
      const lastPage = history[history.length - 1];
      const secondLastPage = history[history.length - 2];
      if (response.statusCode !== 200) {
        if (lastPage && lastPage !== requestUrl) {
          request.session.previousPage = lastPage;
        }
        return;
      }
      if (requestUrl === import_paths.default.TASK_LIST) {
        request.session.pageHistory = [requestUrl];
        request.session.previousPage = void 0;
        return;
      }
      if (isTrackedPath) {
        request.session.pageHistory = history;
        if (secondLastPage === requestUrl) {
          history.pop();
        } else if (lastPage !== requestUrl) {
          history.push(requestUrl);
          if (history.length >= 20) {
            history.shift();
          }
        }
        const previousPage = history[history.length - 2];
        request.session.previousPage = previousPage && previousPage !== requestUrl ? previousPage : void 0;
      } else {
        if (lastPage && lastPage !== requestUrl) {
          request.session.previousPage = lastPage;
        }
      }
    });
    next();
  });
  return router;
};
var setupHistory_default = setupHistory;
//# sourceMappingURL=setupHistory.js.map
