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
var pdfUtils_exports = {};
__export(pdfUtils_exports, {
  stripPdfMetadata: () => stripPdfMetadata,
  validateResponseAgainstSnapshot: () => validateResponseAgainstSnapshot
});
module.exports = __toCommonJS(pdfUtils_exports);
var import_crypto = require("crypto");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
const stripPdfMetadata = (pdfBuffer) => {
  const pdfText = pdfBuffer.toString("latin1");
  return pdfText.replace(/\/CreationDate\s+\(D:[^)]+\)/g, "").replace(/\/ModDate\s+\(D:[^)]+\)/g, "").replace(/\/ID\s+\[\s*<[^>]+>\s*<[^>]+>\s*\]/gs, "").replace(/\/Producer\s+\([^)]+\)/g, "").replace(/\/Creator\s+\([^)]+\)/g, "").replace(/\/Title\s+\([^)]+\)/g, "").replace(/\/Author\s+\([^)]+\)/g, "").replace(/\/Subject\s+\([^)]+\)/g, "").replace(/\/Keywords\s+\([^)]+\)/g, "");
};
const validateResponseAgainstSnapshot = (response, snapshotName) => {
  const responseHash = (0, import_crypto.createHash)("sha256").update(stripPdfMetadata(response)).digest("hex");
  const projectRoot = process.cwd();
  const snapshotPath = import_path.default.join(projectRoot, snapshotName);
  const referenceFile = import_fs.default.readFileSync(snapshotPath);
  const referenceHash = (0, import_crypto.createHash)("sha256").update(stripPdfMetadata(referenceFile)).digest("hex");
  try {
    expect(responseHash).toEqual(referenceHash);
  } catch (error) {
    if (process.env.UPDATE_PDF_SNAPSHOTS) {
      import_fs.default.writeFileSync(snapshotPath, response);
    } else {
      throw error;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  stripPdfMetadata,
  validateResponseAgainstSnapshot
});
//# sourceMappingURL=pdfUtils.js.map
