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
var splittableText_exports = {};
__export(splittableText_exports, {
  default: () => splittableText_default
});
module.exports = __toCommonJS(splittableText_exports);
var import_pdfConstants = require("../../constants/pdfConstants");
var import_logger = __toESM(require("../../logging/logger"));
class SplittableText {
  pdf;
  paragraphs;
  stagedParagraphsHeight = 0;
  stagedParagraphsToAdd = [];
  MIN_LINES_OF_TEXT = 3;
  constructor(pdf, paragraphs) {
    this.pdf = pdf;
    this.paragraphs = paragraphs;
  }
  splitParagraph(paragraph) {
    const paragraphs = [];
    const lines = this.pdf.splitParagraph(paragraph);
    paragraphs.push({
      text: lines.slice(0, this.MIN_LINES_OF_TEXT).join("\n"),
      size: paragraph.size,
      style: paragraph.style,
      bottomPadding: import_pdfConstants.LINE_HEIGHT_RATIO * import_pdfConstants.MM_PER_POINT
    });
    lines.slice(3, lines.length).forEach((line) => {
      paragraphs.push({
        canStartNewPage: true,
        text: line,
        size: paragraph.size,
        style: paragraph.style,
        bottomPadding: import_pdfConstants.LINE_HEIGHT_RATIO * import_pdfConstants.MM_PER_POINT
      });
    });
    paragraphs[paragraphs.length - 1].bottomPadding = paragraph.bottomPadding;
    return paragraphs;
  }
  addStagedParagraphsToDocument() {
    if (this.pdf.heightWillOverflowDocument(this.stagedParagraphsHeight)) {
      this.pdf.createNewPage();
    }
    if (this.pdf.heightWillOverflowDocument(this.stagedParagraphsHeight)) {
      import_logger.default.error("Creating a PDF with an overflowing page");
    }
    this.stagedParagraphsToAdd.forEach((paragraph) => {
      this.pdf.addParagraph(paragraph);
    });
    this.stagedParagraphsHeight = 0;
    this.stagedParagraphsToAdd = [];
  }
  addParagraphToStaging(paragraph) {
    this.stagedParagraphsHeight += this.pdf.getParagraphHeight(paragraph);
    this.stagedParagraphsToAdd.push(paragraph);
  }
  addComponentToDocument() {
    const splitParagraphs = this.paragraphs.flatMap((paragraph) => {
      if (paragraph.splittable) {
        return this.splitParagraph(paragraph);
      } else {
        return paragraph;
      }
    });
    splitParagraphs.forEach((paragraph) => {
      if (paragraph.canStartNewPage) {
        this.addStagedParagraphsToDocument();
      }
      return this.addParagraphToStaging(paragraph);
    });
    this.addStagedParagraphsToDocument();
  }
}
var splittableText_default = SplittableText;
//# sourceMappingURL=splittableText.js.map
