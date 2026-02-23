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
var bulletList_exports = {};
__export(bulletList_exports, {
  default: () => bulletList_default
});
module.exports = __toCommonJS(bulletList_exports);
var import_pdfConstants = require("../../constants/pdfConstants");
var import_fontStyles = __toESM(require("../fontStyles"));
var import_text = __toESM(require("./text"));
class BulletList extends import_text.default {
  constructor(pdf, {
    initialText,
    bulletText,
    finalText
  }) {
    const paragraphs = initialText || [];
    paragraphs.push({
      text: bulletText.map((text) => `\u2022   ${text}`).join("\n"),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    });
    if (finalText) paragraphs.push(...finalText);
    super(pdf, paragraphs);
  }
}
var bulletList_default = BulletList;
//# sourceMappingURL=bulletList.js.map
