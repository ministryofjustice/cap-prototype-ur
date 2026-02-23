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
var addHandoverAndHolidays_exports = {};
__export(addHandoverAndHolidays_exports, {
  default: () => addHandoverAndHolidays_default
});
module.exports = __toCommonJS(addHandoverAndHolidays_exports);
var import_formattedAnswersForPdf = require("../utils/formattedAnswersForPdf");
var import_addAnswer = __toESM(require("./addAnswer"));
const addGetBetweenHouseholds = (request) => {
  return (0, import_addAnswer.default)(
    request.__("taskList.handoverAndHolidays"),
    request.__("handoverAndHolidays.getBetweenHouseholds.title"),
    void 0,
    (0, import_formattedAnswersForPdf.getBetweenHouseholds)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.getBetweenHouseholds"),
    request
  );
};
const addWhereHandover = (request) => {
  return (0, import_addAnswer.default)(
    void 0,
    request.__("handoverAndHolidays.whereHandover.title"),
    request.__("handoverAndHolidays.whereHandover.explainer"),
    (0, import_formattedAnswersForPdf.whereHandover)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.whereHandover"),
    request
  );
};
const addWillChangeDuringSchoolHolidays = (request) => {
  return (0, import_addAnswer.default)(
    void 0,
    request.__("handoverAndHolidays.willChangeDuringSchoolHolidays.title"),
    void 0,
    (0, import_formattedAnswersForPdf.willChangeDuringSchoolHolidays)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.willChangeDuringSchoolHolidays"),
    request
  );
};
const addHowChangeDuringSchoolHolidays = (request) => {
  const answer = (0, import_formattedAnswersForPdf.howChangeDuringSchoolHolidays)(request);
  if (!answer) {
    return "";
  }
  return (0, import_addAnswer.default)(
    void 0,
    request.__("handoverAndHolidays.howChangeDuringSchoolHolidays.title"),
    request.__("handoverAndHolidays.howChangeDuringSchoolHolidays.content"),
    answer,
    request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.howChangeDuringSchoolHolidays"),
    request
  );
};
const addItemsForChangeover = (request) => {
  return (0, import_addAnswer.default)(
    void 0,
    request.__("handoverAndHolidays.itemsForChangeover.title"),
    void 0,
    (0, import_formattedAnswersForPdf.itemsForChangeover)(request),
    request.__("sharePlan.yourProposedPlan.doNotAgree.handoverAndHolidays.itemsForChangeover"),
    request
  );
};
const addHandoverAndHolidays = (request) => {
  const answers = [
    addGetBetweenHouseholds(request),
    addWhereHandover(request),
    addWillChangeDuringSchoolHolidays(request),
    addHowChangeDuringSchoolHolidays(request),
    addItemsForChangeover(request)
  ].filter((item) => item !== "");
  if (answers.length === 0) {
    return "";
  }
  let html = '<section id="handover-holidays" aria-labelledby="handover-holidays-heading">\n';
  html += answers.join("\n");
  html += (0, import_addAnswer.renderTextBox)(
    request.__("sharePlan.yourProposedPlan.endOfSection"),
    request.__("sharePlan.yourProposedPlan.compromise.handoverAndHolidays")
  );
  html += "</section>\n\n";
  return html;
};
var addHandoverAndHolidays_default = addHandoverAndHolidays;
//# sourceMappingURL=addHandoverAndHolidays.js.map
