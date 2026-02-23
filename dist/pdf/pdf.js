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
var pdf_exports = {};
__export(pdf_exports, {
  default: () => pdf_default
});
module.exports = __toCommonJS(pdf_exports);
var import_fs = __toESM(require("fs"));
var import_jspdf = require("jspdf");
var import_pdfConstants = require("../constants/pdfConstants");
var import_logger = __toESM(require("../logging/logger"));
var import_getAssetPath = __toESM(require("../utils/getAssetPath"));
var import_fontStyles = __toESM(require("./fontStyles"));
class Pdf {
  document;
  request;
  maxPageWidth;
  currentY = import_pdfConstants.HEADER_HEIGHT;
  logoData = `data:image/png;base64,${import_fs.default.readFileSync((0, import_getAssetPath.default)("images/crest.png"), { encoding: "base64" })}`;
  constructor(autoPrint, request) {
    this.request = request;
    this.document = new import_jspdf.jsPDF({ lineHeight: import_pdfConstants.LINE_HEIGHT_RATIO });
    this.document.allowFsRead = [(0, import_getAssetPath.default)("fonts/") + "*"];
    this.maxPageWidth = this.document.internal.pageSize.getWidth() - 2 * import_pdfConstants.MARGIN_WIDTH;
    this.setupFonts();
    this.document.setProperties({
      title: request.__("pdf.name")
    });
    if (autoPrint) this.document.autoPrint();
    this.addHeaderToPage();
  }
  toArrayBuffer() {
    return this.document.output("arraybuffer");
  }
  addFooterToEveryPage() {
    for (let pageNumber = 1; pageNumber <= this.document.getNumberOfPages(); pageNumber++) {
      this.document.setPage(pageNumber);
      this.addFooterToPage(pageNumber);
    }
  }
  setupFonts() {
    this.document.addFileToVFS(
      "bold-b542beb274-v2.ttf",
      import_fs.default.readFileSync((0, import_getAssetPath.default)("fonts/bold-b542beb274-v2.ttf")).toString("base64")
    );
    this.document.addFont("bold-b542beb274-v2.ttf", import_pdfConstants.FONT, import_fontStyles.default.BOLD);
    this.document.addFileToVFS(
      "light-94a07e06a1-v2.ttf",
      import_fs.default.readFileSync((0, import_getAssetPath.default)("fonts/light-94a07e06a1-v2.ttf")).toString("base64")
    );
    this.document.addFont("light-94a07e06a1-v2.ttf", import_pdfConstants.FONT, import_fontStyles.default.NORMAL);
  }
  addHeaderToPage() {
    this.document.setFillColor(29, 112, 184).rect(0, 0, this.document.internal.pageSize.getWidth(), import_pdfConstants.HEADER_HEIGHT, "F");
    const logoHeight = 8;
    const logoWidth = logoHeight * 5;
    this.document.addImage(
      this.logoData,
      "PNG",
      import_pdfConstants.MARGIN_WIDTH,
      0.5 * (import_pdfConstants.HEADER_HEIGHT - logoHeight),
      logoWidth,
      logoHeight
    );
    this.document.setFont(import_pdfConstants.FONT, import_fontStyles.default.BOLD).setFontSize(import_pdfConstants.SECTION_HEADING_SIZE).setTextColor(255, 255, 255).text(
      this.request.__("pdf.name"),
      logoWidth + import_pdfConstants.MARGIN_WIDTH + 0.5 * (this.document.internal.pageSize.getWidth() - logoWidth - import_pdfConstants.MARGIN_WIDTH),
      import_pdfConstants.HEADER_HEIGHT * 0.5 + 0.25 * import_pdfConstants.LINE_HEIGHT_RATIO * import_pdfConstants.SECTION_HEADING_SIZE * import_pdfConstants.MM_PER_POINT,
      { align: "center" }
    ).setTextColor(0, 0, 0);
  }
  addFooterToPage(pageNumber) {
    const pageCountText = this.request.__("pdf.pageCount", {
      currentPage: pageNumber.toString(),
      totalPages: this.document.getNumberOfPages().toString()
    });
    const extraFooterText = this.request.__("pdf.everyPageReminder") || "";
    const pageWidth = this.document.internal.pageSize.getWidth();
    const pageHeight = this.document.internal.pageSize.getHeight();
    const footerY = pageHeight - import_pdfConstants.MARGIN_WIDTH;
    if (extraFooterText) {
      this.document.setFont(import_pdfConstants.FONT, import_fontStyles.default.BOLD).setFontSize(import_pdfConstants.MAIN_TEXT_SIZE).text(extraFooterText, pageWidth / 2, footerY, { align: "center" });
    }
    this.document.setFont(import_pdfConstants.FONT, import_fontStyles.default.NORMAL).setFontSize(import_pdfConstants.MAIN_TEXT_SIZE).text(pageCountText, pageWidth - import_pdfConstants.MARGIN_WIDTH, footerY, { align: "right" });
  }
  heightWillOverflowDocument(height) {
    return height + this.currentY > this.document.internal.pageSize.getHeight() - import_pdfConstants.FOOTER_HEIGHT;
  }
  createNewPage() {
    this.document.addPage();
    this.currentY = import_pdfConstants.HEADER_HEIGHT;
    this.addHeaderToPage();
  }
  drawBorder(x, y, xSize, ySize) {
    this.document.setDrawColor("black");
    this.document.setLineWidth(0.5);
    this.document.rect(x - 0.3, y - 0.3, xSize + 0.6, ySize + 0.6);
  }
  splitParagraph({ text, size, style }) {
    this.document.setFontSize(size).setFont(import_pdfConstants.FONT, style);
    return this.document.splitTextToSize(text, this.maxPageWidth);
  }
  getParagraphHeight({ text, size, style, bottomPadding }) {
    this.document.setFontSize(size).setFont(import_pdfConstants.FONT, style);
    const textLines = this.splitParagraph({ text, size, style });
    return size * import_pdfConstants.LINE_HEIGHT_RATIO * textLines.length * import_pdfConstants.MM_PER_POINT + bottomPadding;
  }
  getTextWidth({ text, size, style }) {
    this.document.setFontSize(size).setFont(import_pdfConstants.FONT, style);
    return this.document.getTextWidth(text);
  }
  addText({
    text,
    x,
    y,
    size,
    style
  }) {
    this.document.setFontSize(size).setFont(import_pdfConstants.FONT, style).text(text, x, y);
  }
  addUrlizedParagraph({
    text,
    size,
    style
  }, urls) {
    this.document.setFontSize(size).setFont(import_pdfConstants.FONT, style);
    let startedUrl;
    text.forEach((line) => {
      this.currentY += size * import_pdfConstants.LINE_HEIGHT_RATIO * import_pdfConstants.MM_PER_POINT;
      let currentX = import_pdfConstants.MARGIN_WIDTH;
      line.trim().split(/(\s+)/).forEach((word) => {
        const nextUrl = urls[0];
        const matches = RegExp(/^(\(|<|&lt;)?(.*?)(\.|,|\)|\n|&gt;)?$/).exec(word);
        const leadingPunctuation = matches[1] || "";
        const wordWithoutPunctuation = matches[2];
        const trailingPunctuation = matches[3] || "";
        if (leadingPunctuation) {
          this.document.text(leadingPunctuation, currentX, this.currentY);
          currentX += this.getTextWidth({ text: leadingPunctuation, size, style });
        }
        if (nextUrl?.startsWith(wordWithoutPunctuation) || startedUrl?.endsWith(wordWithoutPunctuation)) {
          startedUrl = nextUrl;
          this.document.textWithLink(wordWithoutPunctuation, currentX, this.currentY, { url: nextUrl });
        } else {
          this.document.text(wordWithoutPunctuation, currentX, this.currentY);
        }
        currentX += this.getTextWidth({ text: wordWithoutPunctuation, size, style });
        if (startedUrl?.endsWith(wordWithoutPunctuation)) {
          startedUrl = void 0;
          urls.shift();
        }
        if (trailingPunctuation) {
          this.document.text(trailingPunctuation, currentX, this.currentY);
          currentX += this.getTextWidth({ text: trailingPunctuation, size, style });
        }
      });
    });
  }
  addParagraph({ text, size, style, bottomPadding, urlize }) {
    const textLines = this.splitParagraph({ text, size, style });
    if (urlize) {
      const urls = (text.match(/https?:\/\/\S+/g) || []).map((url) => url.replace(/^[(|<|&lt;]+|[.|,|)|\n|&gt;]+$/g, ""));
      this.addUrlizedParagraph({ text: textLines, size, style }, urls);
      if (urls.length !== 0) {
        import_logger.default.error("URL was not linked in PDF. URL missed: " + urls);
      }
    } else {
      this.currentY += size * import_pdfConstants.LINE_HEIGHT_RATIO * import_pdfConstants.MM_PER_POINT;
      this.addText({ text: textLines, x: import_pdfConstants.MARGIN_WIDTH, y: this.currentY, size, style });
      this.currentY += size * import_pdfConstants.LINE_HEIGHT_RATIO * (textLines.length - 1) * import_pdfConstants.MM_PER_POINT;
    }
    this.currentY += bottomPadding;
  }
}
var pdf_default = Pdf;
//# sourceMappingURL=pdf.js.map
