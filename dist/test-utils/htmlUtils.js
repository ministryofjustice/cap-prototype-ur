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
var htmlUtils_exports = {};
__export(htmlUtils_exports, {
  expectHtmlNotToContain: () => expectHtmlNotToContain,
  expectHtmlToContain: () => expectHtmlToContain,
  normalizeHtml: () => normalizeHtml,
  validateHtmlAgainstSnapshot: () => validateHtmlAgainstSnapshot,
  validateHtmlStructure: () => validateHtmlStructure
});
module.exports = __toCommonJS(htmlUtils_exports);
var import_crypto = require("crypto");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
const normalizeHtml = (html) => {
  return html.replace(/\r\n/g, "\n").replace(/>\s+</g, "><").trim();
};
const validateHtmlAgainstSnapshot = (response, snapshotName) => {
  const normalizedResponse = normalizeHtml(response);
  const responseHash = (0, import_crypto.createHash)("sha256").update(normalizedResponse).digest("hex");
  const snapshotPath = import_path.default.resolve(__dirname, snapshotName);
  if (!import_fs.default.existsSync(snapshotPath) && !process.env.UPDATE_HTML_SNAPSHOTS) {
    throw new Error(`Snapshot file does not exist: ${snapshotPath}. Run with UPDATE_HTML_SNAPSHOTS=1 to create it.`);
  }
  if (import_fs.default.existsSync(snapshotPath)) {
    const referenceFile = import_fs.default.readFileSync(snapshotPath, "utf-8");
    const normalizedReference = normalizeHtml(referenceFile);
    const referenceHash = (0, import_crypto.createHash)("sha256").update(normalizedReference).digest("hex");
    try {
      expect(responseHash).toEqual(referenceHash);
    } catch (error) {
      if (process.env.UPDATE_HTML_SNAPSHOTS) {
        import_fs.default.writeFileSync(snapshotPath, response);
      } else {
        throw error;
      }
    }
  } else if (process.env.UPDATE_HTML_SNAPSHOTS) {
    const dir = import_path.default.dirname(snapshotPath);
    if (!import_fs.default.existsSync(dir)) {
      import_fs.default.mkdirSync(dir, { recursive: true });
    }
    import_fs.default.writeFileSync(snapshotPath, response);
  }
};
const validateHtmlStructure = (html) => {
  expect(html).toBeTruthy();
  expect(typeof html).toBe("string");
  if (html.includes("<section")) {
    expect(html).toMatch(/aria-labelledby=["'][^"']+["']/);
  }
  return true;
};
const expectHtmlToContain = (html, ...contents) => {
  contents.forEach((content) => {
    expect(html).toContain(content);
  });
};
const expectHtmlNotToContain = (html, ...contents) => {
  contents.forEach((content) => {
    expect(html).not.toContain(content);
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  expectHtmlNotToContain,
  expectHtmlToContain,
  normalizeHtml,
  validateHtmlAgainstSnapshot,
  validateHtmlStructure
});
//# sourceMappingURL=htmlUtils.js.map
