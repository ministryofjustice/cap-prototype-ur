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
var analyticsService_exports = {};
__export(analyticsService_exports, {
  logDownload: () => logDownload,
  logEvent: () => logEvent,
  logLinkClick: () => logLinkClick,
  logPageExit: () => logPageExit,
  logPageVisit: () => logPageVisit,
  logQuickExit: () => logQuickExit
});
module.exports = __toCommonJS(analyticsService_exports);
var import_config = __toESM(require("../config"));
var import_userEvents = __toESM(require("../constants/userEvents"));
var import_logger = __toESM(require("../logging/logger"));
var import_hashedIdentifier = require("../utils/hashedIdentifier");
const logEvent = (eventType, data) => {
  if (!import_config.default.analytics.enabled) {
    return;
  }
  const logEntry = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    event_type: eventType,
    ...data
  };
  import_logger.default.info(logEntry, `${eventType} event`);
};
const logPageVisit = (req, res) => {
  const { method, path } = req;
  const { statusCode } = res;
  const hashedUserId = (0, import_hashedIdentifier.generateHashedIdentifier)(req.ip, req.get("user-agent"));
  const eventData = {
    hashed_user_id: hashedUserId,
    path,
    method,
    status_code: statusCode
  };
  logEvent(import_userEvents.default.PAGE_VISIT, eventData);
};
const logDownload = (req, downloadType) => {
  const hashedUserId = (0, import_hashedIdentifier.generateHashedIdentifier)(req.ip, req.get("user-agent"));
  const eventData = {
    hashed_user_id: hashedUserId,
    download_type: downloadType,
    path: req.path
  };
  logEvent(import_userEvents.default.DOWNLOAD, eventData);
};
const logLinkClick = (req, linkUrl, linkText, linkType, currentPage) => {
  const hashedUserId = (0, import_hashedIdentifier.generateHashedIdentifier)(req.ip, req.get("user-agent"));
  const eventData = {
    hashed_user_id: hashedUserId,
    link_url: linkUrl,
    page: currentPage || req.path
  };
  if (linkText) {
    eventData.link_text = linkText;
  }
  if (linkType) {
    eventData.link_type = linkType;
  }
  logEvent(import_userEvents.default.LINK_CLICK, eventData);
};
const logPageExit = (req, exitPage, destinationUrl) => {
  const hashedUserId = (0, import_hashedIdentifier.generateHashedIdentifier)(req.ip, req.get("user-agent"));
  const eventData = {
    hashed_user_id: hashedUserId,
    exit_page: exitPage,
    path: req.path
  };
  if (destinationUrl) {
    eventData.destination_url = destinationUrl;
  }
  logEvent(import_userEvents.default.PAGE_EXIT, eventData);
};
const logQuickExit = (req, exitPage) => {
  const hashedUserId = (0, import_hashedIdentifier.generateHashedIdentifier)(req.ip, req.get("user-agent"));
  const eventData = {
    hashed_user_id: hashedUserId,
    exit_page: exitPage,
    path: req.path
  };
  logEvent(import_userEvents.default.QUICK_EXIT, eventData);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  logDownload,
  logEvent,
  logLinkClick,
  logPageExit,
  logPageVisit,
  logQuickExit
});
//# sourceMappingURL=analyticsService.js.map
