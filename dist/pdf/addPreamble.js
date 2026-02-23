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
var addPreamble_exports = {};
__export(addPreamble_exports, {
  default: () => addPreamble_default
});
module.exports = __toCommonJS(addPreamble_exports);
var import_pdfConstants = require("../constants/pdfConstants");
var import_sessionHelpers = require("../utils/sessionHelpers");
var import_bulletList = __toESM(require("./components/bulletList"));
var import_text = __toESM(require("./components/text"));
var import_fontStyles = __toESM(require("./fontStyles"));
const addPreamble = (pdf) => {
  const request = pdf.request;
  new import_text.default(pdf, [
    {
      text: request.__("sharePlan.whatWeAreTelling.proposedPlan", {
        childrenNames: (0, import_sessionHelpers.formattedChildrenNames)(request)
      }),
      size: import_pdfConstants.SECTION_HEADING_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.whatWeAreTelling.whatYouNeedToDo"),
      size: import_pdfConstants.QUESTION_TITLE_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.whatWeAreTelling.initialIsAsking", {
        senderName: request.session.initialAdultName,
        childrenNames: (0, import_sessionHelpers.formattedChildrenNames)(request)
      }),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.whatWeAreTelling.pleaseReadThrough", {
        senderName: request.session.initialAdultName
      }),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    }
  ]).addComponentToDocument();
  new import_bulletList.default(pdf, {
    initialText: [
      {
        text: request.__("sharePlan.whatWeAreTelling.thePlanYouveBeenSent"),
        size: import_pdfConstants.QUESTION_TITLE_SIZE,
        style: import_fontStyles.default.BOLD,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      },
      {
        text: request.__("sharePlan.whatWeAreTelling.doNotNeedToAccept", {
          senderName: request.session.initialAdultName,
          childrenNames: (0, import_sessionHelpers.formattedChildrenNames)(request)
        }),
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.NORMAL,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      },
      {
        text: request.__("sharePlan.whatWeAreTelling.insteadYouCan", {
          senderName: request.session.initialAdultName
        }),
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.NORMAL,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      }
    ],
    bulletText: [
      request.__("sharePlan.whatWeAreTelling.suggestChanges", {
        senderName: request.session.initialAdultName
      }),
      request.__("sharePlan.whatWeAreTelling.startYourOwn"),
      request.__("sharePlan.whatWeAreTelling.makeCustom")
    ]
  }).addComponentToDocument();
  new import_bulletList.default(pdf, {
    initialText: [{
      text: request.__("sharePlan.whatWeAreTelling.benefitsHeading"),
      size: import_pdfConstants.QUESTION_TITLE_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    }],
    bulletText: [
      request.__("sharePlan.whatWeAreTelling.avoidCourt", {
        senderName: request.session.initialAdultName,
        childrenNames: (0, import_sessionHelpers.formattedChildrenNames)(request)
      }),
      request.__("sharePlan.whatWeAreTelling.takesAround"),
      request.__("sharePlan.whatWeAreTelling.bestOutcome"),
      request.__("sharePlan.whatWeAreTelling.judgeMakeDecisions")
    ]
  }).addComponentToDocument();
  new import_text.default(pdf, [
    {
      text: request.__("sharePlan.whatWeAreTelling.topTips"),
      size: import_pdfConstants.QUESTION_TITLE_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.whatWeAreTelling.childrensInput", { senderName: request.session.initialAdultName }),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    }
  ]).addComponentToDocument();
  new import_bulletList.default(pdf, {
    initialText: [
      {
        text: request.__("sharePlan.whatWeAreTelling.moreInfoHeading"),
        size: import_pdfConstants.QUESTION_TITLE_SIZE,
        style: import_fontStyles.default.BOLD,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      },
      {
        text: request.__("sharePlan.whatWeAreTelling.moreInfo"),
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.NORMAL,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      }
    ],
    bulletText: [
      request.__("sharePlan.whatWeAreTelling.separatingOrDivorcing"),
      request.__("sharePlan.whatWeAreTelling.makingChildArrangements")
    ]
  }).addComponentToDocument();
  new import_bulletList.default(pdf, {
    initialText: [
      {
        text: request.__("sharePlan.whatWeAreTelling.safetyCheckHeading"),
        size: import_pdfConstants.QUESTION_TITLE_SIZE,
        style: import_fontStyles.default.BOLD,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      },
      {
        text: request.__("sharePlan.whatWeAreTelling.safetyCheck"),
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.NORMAL,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      },
      {
        text: request.__("sharePlan.whatWeAreTelling.doNotContinueIf"),
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.BOLD,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
      }
    ],
    bulletText: [
      request.__("childrenSafetyCheck.domesticAbuse"),
      request.__("childrenSafetyCheck.childAbduction"),
      request.__("childrenSafetyCheck.childAbuse"),
      request.__("childrenSafetyCheck.drugsOrAlcohol"),
      request.__("childrenSafetyCheck.otherConcerns")
    ],
    finalText: [
      {
        text: request.__("sharePlan.whatWeAreTelling.stopIfAnyConcern"),
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.BOLD,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE,
        urlize: true
      },
      {
        text: request.__("sharePlan.whatWeAreTelling.findAnotherWay"),
        size: import_pdfConstants.MAIN_TEXT_SIZE,
        style: import_fontStyles.default.NORMAL,
        bottomPadding: import_pdfConstants.PARAGRAPH_SPACE,
        urlize: true
      }
    ]
  }).addComponentToDocument();
  new import_text.default(pdf, [
    {
      text: request.__("sharePlan.whatWeAreTelling.gettingHelpHeading"),
      size: import_pdfConstants.QUESTION_TITLE_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.whatWeAreTelling.gettingHelp"),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE,
      urlize: true
    },
    {
      text: request.__("sharePlan.whatWeAreTelling.unsureVictim"),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE,
      urlize: true
    }
  ]).addComponentToDocument();
  new import_text.default(pdf, [
    {
      text: request.__("sharePlan.whatWeAreTelling.courtOrderHeading"),
      size: import_pdfConstants.QUESTION_TITLE_SIZE,
      style: import_fontStyles.default.BOLD,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE
    },
    {
      text: request.__("sharePlan.whatWeAreTelling.ifCourtOrderInIsPlace"),
      size: import_pdfConstants.MAIN_TEXT_SIZE,
      style: import_fontStyles.default.NORMAL,
      bottomPadding: import_pdfConstants.PARAGRAPH_SPACE,
      urlize: true
    }
  ]).addComponentToDocument();
};
var addPreamble_default = addPreamble;
//# sourceMappingURL=addPreamble.js.map
