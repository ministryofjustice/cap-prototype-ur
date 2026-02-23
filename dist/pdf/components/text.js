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
var text_exports = {};
__export(text_exports, {
  default: () => text_default
});
module.exports = __toCommonJS(text_exports);
var import_logger = __toESM(require("../../logging/logger"));
var import_base = __toESM(require("./base"));
class Text extends import_base.default {
  paragraphs;
  constructor(pdf, paragraphs) {
    super(pdf);
    this.paragraphs = paragraphs;
  }
  getComponentHeight() {
    return this.paragraphs.reduce((currentHeight, paragraph) => {
      return currentHeight + this.pdf.getParagraphHeight(paragraph);
    }, 0);
  }
  createComponent() {
    this.paragraphs.forEach((paragraph) => {
      this.pdf.addParagraph(paragraph);
    });
  }
  handleComponentOverflowingPage() {
    this.pdf.createNewPage();
    if (this.pdf.heightWillOverflowDocument(this.getComponentHeight())) {
      import_logger.default.error("Creating a PDF with an overflowing page");
    }
    this.createComponent();
  }
}
var text_default = Text;
//# sourceMappingURL=text.js.map
