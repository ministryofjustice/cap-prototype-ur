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
var textbox_exports = {};
__export(textbox_exports, {
  default: () => textbox_default
});
module.exports = __toCommonJS(textbox_exports);
var import_jspdf = require("jspdf");
var import_pdfConstants = require("../../constants/pdfConstants");
var import_text = __toESM(require("./text"));
class Textbox extends import_text.default {
  TEXTBOX_HEIGHT = 20;
  constructor(pdf, paragraphs) {
    super(pdf, paragraphs);
  }
  getComponentHeight() {
    return super.getComponentHeight() + this.TEXTBOX_HEIGHT + import_pdfConstants.PARAGRAPH_SPACE;
  }
  createComponent() {
    super.createComponent();
    const textField = new import_jspdf.AcroFormTextField();
    textField.multiline = true;
    textField.x = import_pdfConstants.MARGIN_WIDTH;
    textField.y = this.pdf.currentY;
    textField.width = this.pdf.maxPageWidth;
    textField.height = this.TEXTBOX_HEIGHT;
    this.pdf.document.addField(textField);
    this.pdf.drawBorder(import_pdfConstants.MARGIN_WIDTH, this.pdf.currentY, this.pdf.maxPageWidth, this.TEXTBOX_HEIGHT);
    this.pdf.currentY += this.TEXTBOX_HEIGHT + import_pdfConstants.PARAGRAPH_SPACE;
  }
}
var textbox_default = Textbox;
//# sourceMappingURL=textbox.js.map
