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
var import_pdfConstants = require("../constants/pdfConstants");
var import_formattedAnswersForPdf = require("../utils/formattedAnswersForPdf");
var import_sessionHelpers = require("../utils/sessionHelpers");
var import_addAnswer = __toESM(require("./addAnswer"));
var import_textbox = __toESM(require("./components/textbox"));
var import_fontStyles = __toESM(require("./fontStyles"));
const addMostlyLive = (pdf, request) => {
  (0, import_addAnswer.default)(
    pdf,
    request.__("taskList.livingAndVisiting"),
    request.__("livingAndVisiting.mostlyLive.title"),
    void 0,
    (0, import_formattedAnswersForPdf.mostlyLive)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.mostlyLive")
  );
};
const addWhichSchedule = (pdf, request) => {
  (0, import_addAnswer.default)(
    pdf,
    void 0,
    request.__("livingAndVisiting.whichSchedule.title"),
    request.__("livingAndVisiting.whichSchedule.exactSplitWarning"),
    (0, import_formattedAnswersForPdf.whichSchedule)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.whichSchedule")
  );
};
const addWillOvernightsHappen = (pdf, request) => {
  const adult = (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session);
  (0, import_addAnswer.default)(
    pdf,
    void 0,
    request.__("livingAndVisiting.willOvernightsHappen.title", { adult }),
    void 0,
    (0, import_formattedAnswersForPdf.willOvernightsHappen)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.willOvernightsHappen", { adult })
  );
};
const addWhichDaysOvernight = (pdf, request) => {
  (0, import_addAnswer.default)(
    pdf,
    void 0,
    request.__("livingAndVisiting.whichDaysOvernight.title"),
    void 0,
    (0, import_formattedAnswersForPdf.whichDaysOvernight)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.whichDaysOvernight", {
      adult: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session)
    })
  );
};
const addWillDaytimeVisitsHappen = (pdf, request) => {
  (0, import_addAnswer.default)(
    pdf,
    void 0,
    request.__("livingAndVisiting.willDaytimeVisitsHappen.title", { adult: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session) }),
    void 0,
    (0, import_formattedAnswersForPdf.willDaytimeVisitsHappen)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.willDaytimeVisitsHappen")
  );
};
const addWWhichDaysDaytimeVisits = (pdf, request) => {
  (0, import_addAnswer.default)(
    pdf,
    void 0,
    request.__("livingAndVisiting.whichDaysDaytimeVisits.title"),
    void 0,
    (0, import_formattedAnswersForPdf.whichDaysDaytimeVisits)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.livingAndVisiting.whichDaysDaytimeVisits")
  );
};
const addLivingAndVisiting = (pdf) => {
  const request = pdf.request;
  addMostlyLive(pdf, request);
  addWhichSchedule(pdf, request);
  addWillOvernightsHappen(pdf, request);
  addWhichDaysOvernight(pdf, request);
  addWillDaytimeVisitsHappen(pdf, request);
  addWWhichDaysDaytimeVisits(pdf, request);
  new import_textbox.default(pdf, [
    {
      text: request.__("sharePlan.yourProposedPlan.endOfSection"),
      size: import_pdfConstants.QUESTION_TITLE_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.yourProposedPlan.compromise.livingAndVisiting"),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    }
  ]).addComponentToDocument();
};
var addLivingAndVisiting_default = addLivingAndVisiting;
//# sourceMappingURL=addLivingAndVisiting.js.map
