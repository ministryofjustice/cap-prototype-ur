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
var addWhatHappensNow_exports = {};
__export(addWhatHappensNow_exports, {
  default: () => addWhatHappensNow_default
});
module.exports = __toCommonJS(addWhatHappensNow_exports);
var import_config = __toESM(require("../config"));
const escapeHtmlText = (text) => {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
const addWhatHappensNow = (request) => {
  let html = '<section id="what-happens-now" aria-labelledby="what-happens-now-heading">\n';
  html += `  <h2 id="what-happens-now-heading">${escapeHtmlText(request.__("sharePlan.yourProposedPlan.whatHappensNowHeading"))}</h2>
`;
  html += `  <p>${escapeHtmlText(request.__("sharePlan.yourProposedPlan.nowSendPlan", { senderName: request.session.initialAdultName }))}</p>
`;
  html += `  <p>${escapeHtmlText(request.__("sharePlan.yourProposedPlan.notLegallyBinding"))}</p>
`;
  html += `  <h3 id="what-happens-now-heading">${escapeHtmlText(request.__("sharePlan.yourProposedPlan.cantAgreeHeading"))}</h3>
`;
  html += `  <p>${escapeHtmlText(request.__("sharePlan.yourProposedPlan.unableToAgree"))}</p>
`;
  html += `  <p>${escapeHtmlText(request.__("sharePlan.yourProposedPlan.aMediatorIs"))}</p>
`;
  html += `  <p><a href="https://www.gov.uk/looking-after-children-divorce">${escapeHtmlText(request.__("sharePlan.yourProposedPlan.moreInfoAndSupport"))}</a></p>
`;
  html += `  <h3 id="what-happens-now-heading">${escapeHtmlText(request.__("sharePlan.yourProposedPlan.helpUsImproveHeading"))}</h3>
`;
  html += `  <p>${escapeHtmlText(request.__("sharePlan.yourProposedPlan.helpUsImprove"))}</p>
`;
  html += `  <p><b><a href="${import_config.default.feedbackUrl}">${escapeHtmlText(request.__("confirmation.whatDidYouThink"))}</a></b></p>
`;
  html += "</section>\n";
  return html;
};
var addWhatHappensNow_default = addWhatHappensNow;
//# sourceMappingURL=addWhatHappensNow.js.map
