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
var testPdfAppSetup_exports = {};
__export(testPdfAppSetup_exports, {
  TEST_PATH: () => TEST_PATH,
  default: () => testPdfAppSetup_default
});
module.exports = __toCommonJS(testPdfAppSetup_exports);
var import_express = __toESM(require("express"));
var import_setUpi18n = __toESM(require("../middleware/setUpi18n"));
var import_pdf = __toESM(require("../pdf/pdf"));
var import_testMocks = require("../test-utils/testMocks");
const TEST_PATH = "/test";
const testAppSetup = (addToPdf) => {
  const app = (0, import_express.default)();
  app.disable("x-powered-by");
  app.use((0, import_setUpi18n.default)());
  app.use((req, _response, next) => {
    req.session = import_testMocks.sessionMock;
    next();
  });
  app.get(TEST_PATH, (request, response) => {
    const pdf = new import_pdf.default(false, request);
    addToPdf(pdf);
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `attachment; filename=test.pdf`);
    response.send(Buffer.from(pdf.toArrayBuffer()));
  });
  return app;
};
var testPdfAppSetup_default = testAppSetup;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TEST_PATH
});
//# sourceMappingURL=testPdfAppSetup.js.map
