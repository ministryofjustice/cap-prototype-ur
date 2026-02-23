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
var addAboutTheProposal_exports = {};
__export(addAboutTheProposal_exports, {
  default: () => addAboutTheProposal_default
});
module.exports = __toCommonJS(addAboutTheProposal_exports);
var import_pdfConstants = require("../constants/pdfConstants");
var import_sessionHelpers = require("../utils/sessionHelpers");
var import_bulletList = __toESM(require("./components/bulletList"));
var import_doYouAgree = __toESM(require("./components/doYouAgree"));
var import_text = __toESM(require("./components/text"));
var import_fontStyles = __toESM(require("./fontStyles"));
const addAboutTheProposal = (pdf) => {
  const request = pdf.request;
  const { initialAdultName, secondaryAdultName, numberOfChildren } = request.session;
  const childrenNames = (0, import_sessionHelpers.formattedChildrenNames)(request);
  new import_bulletList.default(pdf, {
    initialText: [
      {
        text: request.__("sharePlan.yourProposedPlan.aboutThePlan"),
        size: import_pdfConstants.SECTION_HEADING_SIZE,
        style: import_fontStyles.default.BOLD,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      },
      {
        text: request.__("sharePlan.yourProposedPlan.senderSaid", { senderName: initialAdultName }),
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.NORMAL,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      }
    ],
    bulletText: [
      request.__("sharePlan.yourProposedPlan.noCourtOrder"),
      numberOfChildren === 1 ? request.__("sharePlan.yourProposedPlan.forOneChild", { childName: childrenNames }) : request.__("sharePlan.yourProposedPlan.forMultipleChildren", {
        childrenNames,
        numberOfChildren: numberOfChildren.toString()
      }),
      request.__("sharePlan.yourProposedPlan.agreementBetween", {
        senderName: initialAdultName,
        otherAdultName: secondaryAdultName,
        childrenNames
      })
    ]
  }).addComponentToDocument();
  new import_doYouAgree.default(
    pdf,
    request.__("sharePlan.yourProposedPlan.doYouAgreeOnBasics", { senderName: initialAdultName })
  ).addComponentToDocument();
  new import_text.default(pdf, [
    {
      text: request.__("sharePlan.yourProposedPlan.doNotStoreNames"),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.yourProposedPlan.doNotAgreeOnBasics"),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE,
      urlize: true
    }
  ]).addComponentToDocument();
};
var addAboutTheProposal_default = addAboutTheProposal;
//# sourceMappingURL=addAboutTheProposal.js.map
