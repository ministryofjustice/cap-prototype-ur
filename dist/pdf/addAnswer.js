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
var addAnswer_exports = {};
__export(addAnswer_exports, {
  default: () => addAnswer_default
});
module.exports = __toCommonJS(addAnswer_exports);
var import_pdfConstants = require("../constants/pdfConstants");
var import_doYouAgree = __toESM(require("./components/doYouAgree"));
var import_splittableText = __toESM(require("./components/splittableText"));
var import_textbox = __toESM(require("./components/textbox"));
var import_fontStyles = __toESM(require("./fontStyles"));
const isPerChildAnswer = (answer) => {
  return typeof answer === "object" && "defaultAnswer" in answer;
};
const addAnswer = (pdf, sectionHeading, question, subtext, answer, disagreeText) => {
  if (!answer) return;
  const paragraphs = [
    sectionHeading ? {
      text: sectionHeading,
      size: import_pdfConstants.SECTION_HEADING_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    } : void 0,
    {
      text: question,
      size: import_pdfConstants.QUESTION_TITLE_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    subtext ? {
      text: subtext,
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    } : void 0
  ];
  if (isPerChildAnswer(answer)) {
    const numberOfChildren = pdf.request.session.numberOfChildren || 1;
    const perChildCount = answer.perChildAnswers?.length || 0;
    const hasPerChildAnswers = perChildCount > 0;
    const allChildrenHaveSpecificAnswers = perChildCount >= numberOfChildren;
    if (answer.perChildAnswers) {
      for (const childAnswer of answer.perChildAnswers) {
        paragraphs.push({
          text: `For ${childAnswer.childName}:`,
          size: import_pdfConstants.MAIN_TEXT_SIZE,
          style: import_fontStyles.default.BOLD,
          bottomPadding: import_pdfConstants.PARAGRAPH_SPACE / 2
        });
        paragraphs.push({
          text: childAnswer.answer,
          size: import_pdfConstants.MAIN_TEXT_SIZE,
          style: import_fontStyles.default.NORMAL,
          bottomPadding: import_pdfConstants.PARAGRAPH_SPACE,
          splittable: true
        });
      }
    }
    if (!allChildrenHaveSpecificAnswers && answer.defaultAnswer) {
      paragraphs.push({
        text: hasPerChildAnswers ? "For all other children:" : "For all children:",
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.BOLD,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE / 2
      });
      paragraphs.push({
        text: answer.defaultAnswer,
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.NORMAL,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE,
        splittable: true
      });
    }
  } else {
    paragraphs.push({
      text: answer,
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE,
      splittable: true
    });
  }
  new import_splittableText.default(
    pdf,
    paragraphs.filter((paragraph) => !!paragraph)
  ).addComponentToDocument();
  new import_doYouAgree.default(pdf, pdf.request.__("sharePlan.yourProposedPlan.doYouAgree")).addComponentToDocument();
  new import_textbox.default(pdf, [
    {
      text: disagreeText,
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    }
  ]).addComponentToDocument();
};
var addAnswer_default = addAnswer;
//# sourceMappingURL=addAnswer.js.map
