var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var pdfConstants_exports = {};
__export(pdfConstants_exports, {
  FONT: () => FONT,
  FOOTER_HEIGHT: () => FOOTER_HEIGHT,
  HEADER_HEIGHT: () => HEADER_HEIGHT,
  LINE_HEIGHT_RATIO: () => LINE_HEIGHT_RATIO,
  MAIN_TEXT_SIZE: () => MAIN_TEXT_SIZE,
  MARGIN_WIDTH: () => MARGIN_WIDTH,
  MM_PER_POINT: () => MM_PER_POINT,
  PARAGRAPH_SPACE: () => PARAGRAPH_SPACE,
  QUESTION_TITLE_SIZE: () => QUESTION_TITLE_SIZE,
  SECTION_HEADING_SIZE: () => SECTION_HEADING_SIZE
});
module.exports = __toCommonJS(pdfConstants_exports);
const LINE_HEIGHT_RATIO = 1.5;
const MARGIN_WIDTH = 10;
const PARAGRAPH_SPACE = 5;
const HEADER_HEIGHT = 22.4;
const FOOTER_HEIGHT = 22.4;
const MM_PER_POINT = 0.352778;
const FONT = "transport";
const SECTION_HEADING_SIZE = 22;
const QUESTION_TITLE_SIZE = 14;
const MAIN_TEXT_SIZE = 12;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FONT,
  FOOTER_HEIGHT,
  HEADER_HEIGHT,
  LINE_HEIGHT_RATIO,
  MAIN_TEXT_SIZE,
  MARGIN_WIDTH,
  MM_PER_POINT,
  PARAGRAPH_SPACE,
  QUESTION_TITLE_SIZE,
  SECTION_HEADING_SIZE
});
//# sourceMappingURL=pdfConstants.js.map
