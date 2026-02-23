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
var addSpecialDays_exports = {};
__export(addSpecialDays_exports, {
  default: () => addSpecialDays_default
});
module.exports = __toCommonJS(addSpecialDays_exports);
var import_pdfConstants = require("../constants/pdfConstants");
var import_formattedAnswersForPdf = require("../utils/formattedAnswersForPdf");
var import_addAnswer = __toESM(require("./addAnswer"));
var import_textbox = __toESM(require("./components/textbox"));
var import_fontStyles = __toESM(require("./fontStyles"));
const addSpecialDays = (pdf) => {
  const request = pdf.request;
  (0, import_addAnswer.default)(
    pdf,
    request.__("taskList.specialDays"),
    request.__("specialDays.whatWillHappen.title"),
    request.__("specialDays.whatWillHappen.content"),
    (0, import_formattedAnswersForPdf.whatWillHappen)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.specialDays.whatWillHappen")
  );
  new import_textbox.default(pdf, [
    {
      text: request.__("sharePlan.yourProposedPlan.endOfSection"),
      size: import_pdfConstants.QUESTION_TITLE_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.yourProposedPlan.compromise.specialDays"),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    }
  ]).addComponentToDocument();
};
var addSpecialDays_default = addSpecialDays;
//# sourceMappingURL=addSpecialDays.js.map
