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
var downloads_exports = {};
__export(downloads_exports, {
  default: () => downloads_default
});
module.exports = __toCommonJS(downloads_exports);
var import_fs = __toESM(require("fs"));
var import_paths = __toESM(require("../constants/paths"));
var import_createHtmlContent = __toESM(require("../html/createHtmlContent"));
var import_createPdf = __toESM(require("../pdf/createPdf"));
var import_analyticsService = require("../services/analyticsService");
var import_getAssetPath = __toESM(require("../utils/getAssetPath"));
var import_sessionHelpers = require("../utils/sessionHelpers");
const downloadRoutes = (router) => {
  router.get(import_paths.default.DOWNLOAD_PDF, (request, response) => {
    const pdf = (0, import_createPdf.default)(false, request);
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `attachment; filename=${request.__("pdf.name")}.pdf`);
    response.send(Buffer.from(pdf));
    (0, import_analyticsService.logDownload)(request, "output_pdf");
  });
  router.get(import_paths.default.PRINT_PDF, (request, response) => {
    const pdf = (0, import_createPdf.default)(true, request);
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `inline; filename=${request.__("pdf.name")}.pdf`);
    response.send(Buffer.from(pdf));
  });
  router.get(import_paths.default.DOWNLOAD_PAPER_FORM, (request, response) => {
    response.download((0, import_getAssetPath.default)("other/paperForm.pdf"), `${request.__("pdf.name")}.pdf`);
    (0, import_analyticsService.logDownload)(request, "offline_pdf");
  });
  router.get(import_paths.default.DOWNLOAD_HTML, (request, response) => {
    const htmlContent = (0, import_createHtmlContent.default)(request);
    const childrenNames = (0, import_sessionHelpers.formattedChildrenNames)(request);
    const logoData = import_fs.default.readFileSync((0, import_getAssetPath.default)("images/crest.png"), { encoding: "base64" });
    const logoImageData = `data:image/png;base64,${logoData}`;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("Content-Disposition", `attachment; filename=${request.__("pdf.name")}.html`);
    response.render("pages/downloadablePlan", {
      values: {
        initialAdultName: request.session.initialAdultName,
        secondaryAdultName: request.session.secondaryAdultName,
        numberOfChildren: request.session.numberOfChildren,
        childrenNames
      },
      htmlContent,
      logoImageData
    });
    (0, import_analyticsService.logDownload)(request, "output_html");
  });
};
var downloads_default = downloadRoutes;
//# sourceMappingURL=downloads.js.map
