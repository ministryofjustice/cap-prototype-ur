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
var addOtherThings_exports = {};
__export(addOtherThings_exports, {
  default: () => addOtherThings_default
});
module.exports = __toCommonJS(addOtherThings_exports);
var import_formattedAnswersForPdf = require("../utils/formattedAnswersForPdf");
var import_addAnswer = require("./addAnswer");
const addOtherThings = (request) => {
  const answer = (0, import_formattedAnswersForPdf.whatOtherThingsMatter)(request);
  if (!answer) {
    return "";
  }
  const questionNumber = (0, import_addAnswer.getNextQuestionNumber)();
  const radioName = `question-${questionNumber}`;
  const textareaId = `notes-${questionNumber}`;
  let html = '<section id="other-things" aria-labelledby="other-things-heading">\n';
  html += '<div class="answer-section">\n';
  html += `  <h2>${(0, import_addAnswer.escapeHtmlText)(request.__("taskList.otherThings"))}</h2>
`;
  html += `  <h3>${(0, import_addAnswer.escapeHtmlText)(request.__("otherThings.whatOtherThingsMatter.title"))}</h3>
`;
  html += `  <p>${(0, import_addAnswer.escapeHtmlText)(request.__("otherThings.whatOtherThingsMatter.thingsToAgree"))}</p>
`;
  html += `  <ul>
`;
  html += `    <li>${(0, import_addAnswer.escapeHtmlText)(request.__("otherThings.whatOtherThingsMatter.religionDietAndRules"))}</li>
`;
  html += `    <li>${(0, import_addAnswer.escapeHtmlText)(request.__("otherThings.whatOtherThingsMatter.extraCurriculars"))}</li>
`;
  html += `    <li>${(0, import_addAnswer.escapeHtmlText)(request.__("otherThings.whatOtherThingsMatter.friendsAndFamily"))}</li>
`;
  html += `    <li>${(0, import_addAnswer.escapeHtmlText)(request.__("otherThings.whatOtherThingsMatter.otherContact"))}</li>
`;
  html += `  </ul>
`;
  html += `  <p class="answer">${(0, import_addAnswer.escapeHtmlText)(answer)}</p>
`;
  html += `  <div class="do-you-agree">
`;
  html += `    <p>${(0, import_addAnswer.escapeHtmlText)(request.__("sharePlan.yourProposedPlan.doYouAgree"))}</p>
`;
  html += `    <div class="do-you-agree-options">
`;
  html += `      <label>
`;
  html += `        <input type="radio" name="${radioName}" value="yes">
`;
  html += `        <span>${(0, import_addAnswer.escapeHtmlText)(request.__("yes"))}</span>
`;
  html += `      </label>
`;
  html += `      <label>
`;
  html += `        <input type="radio" name="${radioName}" value="no">
`;
  html += `        <span>${(0, import_addAnswer.escapeHtmlText)(request.__("no"))}</span>
`;
  html += `      </label>
`;
  html += `    </div>
`;
  html += `  </div>
`;
  html += `  <div class="text-box">
`;
  html += `    <p>${(0, import_addAnswer.escapeHtmlText)(request.__("sharePlan.yourProposedPlan.doNotAgree.otherThings.whatOtherThingsMatter"))}</p>
`;
  html += `    <textarea class="user-input-area" id="${textareaId}" aria-label="${(0, import_addAnswer.escapeHtmlText)(request.__("sharePlan.yourProposedPlan.doNotAgree.otherThings.whatOtherThingsMatter"))}"></textarea>
`;
  html += `  </div>
`;
  html += "</div>\n";
  html += (0, import_addAnswer.renderTextBox)(
    request.__("sharePlan.yourProposedPlan.endOfSection"),
    request.__("sharePlan.yourProposedPlan.compromise.otherThings")
  );
  html += "</section>\n\n";
  return html;
};
var addOtherThings_default = addOtherThings;
//# sourceMappingURL=addOtherThings.js.map
