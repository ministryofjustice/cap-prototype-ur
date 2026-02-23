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
var addLivingAndVisiting_exports = {};
__export(addLivingAndVisiting_exports, {
  default: () => addLivingAndVisiting_default
});
module.exports = __toCommonJS(addLivingAndVisiting_exports);
var import_formattedAnswersForPdf = require("../utils/formattedAnswersForPdf");
var import_sessionHelpers = require("../utils/sessionHelpers");
var import_addAnswer = __toESM(require("./addAnswer"));
const addMostlyLive = (request) => {
  return (0, import_addAnswer.default)(
    request.__("taskList.livingAndVisiting"),
    request.__("livingAndVisiting.mostlyLive.title"),
    void 0,
    (0, import_formattedAnswersForPdf.mostlyLive)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.mostlyLive"),
    request
  );
};
const addWhichSchedule = (request) => {
  return (0, import_addAnswer.default)(
    void 0,
    request.__("livingAndVisiting.whichSchedule.title"),
    request.__("livingAndVisiting.whichSchedule.exactSplitWarning"),
    (0, import_formattedAnswersForPdf.whichSchedule)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.whichSchedule"),
    request
  );
};
const addWillOvernightsHappen = (request) => {
  const adult = (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session);
  return (0, import_addAnswer.default)(
    void 0,
    request.__("livingAndVisiting.willOvernightsHappen.title", { adult }),
    void 0,
    (0, import_formattedAnswersForPdf.willOvernightsHappen)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.willOvernightsHappen", { adult }),
    request
  );
};
const addWhichDaysOvernight = (request) => {
  return (0, import_addAnswer.default)(
    void 0,
    request.__("livingAndVisiting.whichDaysOvernight.title"),
    void 0,
    (0, import_formattedAnswersForPdf.whichDaysOvernight)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.whichDaysOvernight", {
      adult: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session)
    }),
    request
  );
};
const addWillDaytimeVisitsHappen = (request) => {
  return (0, import_addAnswer.default)(
    void 0,
    request.__("livingAndVisiting.willDaytimeVisitsHappen.title", { adult: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session) }),
    void 0,
    (0, import_formattedAnswersForPdf.willDaytimeVisitsHappen)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.willDaytimeVisitsHappen"),
    request
  );
};
const addWhichDaysDaytimeVisits = (request) => {
  return (0, import_addAnswer.default)(
    void 0,
    request.__("livingAndVisiting.whichDaysDaytimeVisits.title"),
    void 0,
    (0, import_formattedAnswersForPdf.whichDaysDaytimeVisits)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.whichDaysDaytimeVisits"),
    request
  );
};
const addLivingAndVisiting = (request) => {
  const answers = [
    addMostlyLive(request),
    addWhichSchedule(request),
    addWillOvernightsHappen(request),
    addWhichDaysOvernight(request),
    addWillDaytimeVisitsHappen(request),
    addWhichDaysDaytimeVisits(request)
  ].filter((item) => item !== "");
  if (answers.length === 0) {
    return "";
  }
  let html = '<section id="living-visiting" aria-labelledby="living-visiting-heading">\n';
  html += answers.join("\n");
  html += (0, import_addAnswer.renderTextBox)(
    request.__("sharePlan.yourProposedPlan.endOfSection"),
    request.__("sharePlan.yourProposedPlan.compromise.livingAndVisiting")
  );
  html += "</section>\n\n";
  return html;
};
var addLivingAndVisiting_default = addLivingAndVisiting;
//# sourceMappingURL=addLivingAndVisiting.js.map
