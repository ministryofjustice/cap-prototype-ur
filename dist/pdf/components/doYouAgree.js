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
var doYouAgree_exports = {};
__export(doYouAgree_exports, {
  default: () => doYouAgree_default
});
module.exports = __toCommonJS(doYouAgree_exports);
var import_jspdf = require("jspdf");
var import_pdfConstants = require("../../constants/pdfConstants");
var import_logger = __toESM(require("../../logging/logger"));
var import_fontStyles = __toESM(require("../fontStyles"));
var import_base = __toESM(require("./base"));
class DoYouAgree extends import_base.default {
  radioGroup;
  currentX = import_pdfConstants.MARGIN_WIDTH;
  CHECKBOX_SIZE = 10;
  CHECKBOX_HORIZONTAL_GAP = 7;
  CHECKBOX_TEXT_GAP = 3;
  doYouAgreeParagraph;
  constructor(pdf, text) {
    super(pdf);
    this.doYouAgreeParagraph = {
      text,
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: this.CHECKBOX_TEXT_GAP
    };
    this.radioGroup = new import_jspdf.AcroFormRadioButton();
    this.radioGroup.radio = true;
    this.radioGroup.caption = "8";
  }
  addOption(text) {
    const textWithStyles = {
      text,
      x: this.currentX,
      y: this.pdf.currentY + this.CHECKBOX_SIZE / 2 + 0.25 * import_pdfConstants.LINE_HEIGHT_RATIO * import_pdfConstants.MAIN_TEXT_SIZE * import_pdfConstants.MM_PER_POINT,
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL
    };
    this.pdf.addText(textWithStyles);
    this.currentX += this.pdf.getTextWidth(textWithStyles) + this.CHECKBOX_TEXT_GAP;
    this.pdf.drawBorder(this.currentX, this.pdf.currentY, this.CHECKBOX_SIZE, this.CHECKBOX_SIZE);
    Object.assign(this.radioGroup.createOption(text), {
      x: this.currentX,
      y: this.pdf.currentY,
      width: this.CHECKBOX_SIZE,
      height: this.CHECKBOX_SIZE
    });
    this.currentX += this.CHECKBOX_SIZE + this.CHECKBOX_HORIZONTAL_GAP;
  }
  getComponentHeight() {
    return this.pdf.getParagraphHeight(this.doYouAgreeParagraph) + this.CHECKBOX_SIZE + import_pdfConstants.PARAGRAPH_SPACE;
  }
  createComponent() {
    this.pdf.addParagraph(this.doYouAgreeParagraph);
    this.pdf.document.addField(this.radioGroup);
    this.addOption(this.pdf.request.__("yes"));
    this.addOption(this.pdf.request.__("no"));
    this.radioGroup.setAppearance(this.pdf.document.AcroForm.Appearance.RadioButton.Cross);
    this.pdf.currentY += this.CHECKBOX_SIZE + import_pdfConstants.PARAGRAPH_SPACE;
  }
  handleComponentOverflowingPage() {
    this.pdf.createNewPage();
    if (this.pdf.heightWillOverflowDocument(this.getComponentHeight())) {
      import_logger.default.error("Creating a PDF with an overflowing page");
    }
    this.createComponent();
  }
}
var doYouAgree_default = DoYouAgree;
//# sourceMappingURL=doYouAgree.js.map
