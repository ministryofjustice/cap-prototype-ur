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
var addHandoverAndHolidays_exports = {};
__export(addHandoverAndHolidays_exports, {
  default: () => addHandoverAndHolidays_default
});
module.exports = __toCommonJS(addHandoverAndHolidays_exports);
var import_pdfConstants = require("../constants/pdfConstants");
var import_formattedAnswersForPdf = require("../utils/formattedAnswersForPdf");
var import_addAnswer = __toESM(require("./addAnswer"));
var import_textbox = __toESM(require("./components/textbox"));
var import_fontStyles = __toESM(require("./fontStyles"));
const addGetBetweenHouseholds = (pdf, request) => {
  (0, import_addAnswer.default)(
    pdf,
    request.__("taskList.handoverAndHolidays"),
    request.__("handoverAndHolidays.getBetweenHouseholds.title"),
    void 0,
    (0, import_formattedAnswersForPdf.getBetweenHouseholds)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.getBetweenHouseholds")
  );
};
const addWhereHandover = (pdf, request) => {
  (0, import_addAnswer.default)(
    pdf,
    void 0,
    request.__("handoverAndHolidays.whereHandover.title"),
    request.__("handoverAndHolidays.whereHandover.explainer"),
    (0, import_formattedAnswersForPdf.whereHandover)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.whereHandover")
  );
};
const addWillChangeDuringSchoolHolidays = (pdf, request) => {
  (0, import_addAnswer.default)(
    pdf,
    void 0,
    request.__("handoverAndHolidays.willChangeDuringSchoolHolidays.title"),
    void 0,
    (0, import_formattedAnswersForPdf.willChangeDuringSchoolHolidays)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.willChangeDuringSchoolHolidays")
  );
};
const addHowChangeDuringSchoolHolidays = (pdf, request) => {
  const answer = (0, import_formattedAnswersForPdf.howChangeDuringSchoolHolidays)(request);
  if (answer) {
    (0, import_addAnswer.default)(
      pdf,
      void 0,
      request.__("handoverAndHolidays.howChangeDuringSchoolHolidays.title"),
      request.__("handoverAndHolidays.howChangeDuringSchoolHolidays.content"),
      answer,
      request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.howChangeDuringSchoolHolidays")
    );
  }
};
const addItemsForChangeover = (pdf, request) => {
  (0, import_addAnswer.default)(
    pdf,
    void 0,
    request.__("handoverAndHolidays.itemsForChangeover.title"),
    void 0,
    (0, import_formattedAnswersForPdf.itemsForChangeover)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.itemsForChangeover")
  );
};
const addHandoverAndHolidays = (pdf) => {
  const request = pdf.request;
  addGetBetweenHouseholds(pdf, request);
  addWhereHandover(pdf, request);
  addWillChangeDuringSchoolHolidays(pdf, request);
  addHowChangeDuringSchoolHolidays(pdf, request);
  addItemsForChangeover(pdf, request);
  new import_textbox.default(pdf, [
    {
      text: request.__("sharePlan.yourProposedPlan.endOfSection"),
      size: import_pdfConstants.QUESTION_TITLE_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.yourProposedPlan.compromise.handoverAndHolidays"),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    }
  ]).addComponentToDocument();
};
var addHandoverAndHolidays_default = addHandoverAndHolidays;
//# sourceMappingURL=addHandoverAndHolidays.js.map
