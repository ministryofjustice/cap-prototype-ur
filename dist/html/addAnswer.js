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
var addAnswer_exports = {};
__export(addAnswer_exports, {
  default: () => addAnswer_default,
  escapeHtmlText: () => escapeHtmlText,
  getNextQuestionNumber: () => getNextQuestionNumber,
  isPerChildAnswer: () => isPerChildAnswer,
  renderPerChildAnswerHtml: () => renderPerChildAnswerHtml,
  renderTextBox: () => renderTextBox,
  resetQuestionCounter: () => resetQuestionCounter,
  resetTextboxCounter: () => resetTextboxCounter
});
module.exports = __toCommonJS(addAnswer_exports);
const escapeHtmlText = (text) => {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
const isPerChildAnswer = (answer) => {
  return typeof answer === "object" && "defaultAnswer" in answer;
};
const renderPerChildAnswerHtml = (answer) => {
  let html = "";
  html += `  <p class="govuk-body govuk-!-margin-bottom-1"><strong>For all children:</strong></p>
`;
  html += `  <p class="answer">${escapeHtmlText(answer.defaultAnswer)}</p>
`;
  if (answer.perChildAnswers) {
    for (const childAnswer of answer.perChildAnswers) {
      html += `  <p class="govuk-body govuk-!-margin-bottom-1"><strong>For ${escapeHtmlText(childAnswer.childName)}:</strong></p>
`;
      html += `  <p class="answer">${escapeHtmlText(childAnswer.answer)}</p>
`;
    }
  }
  return html;
};
let questionCounter = 0;
const resetQuestionCounter = () => {
  questionCounter = 0;
};
const getNextQuestionNumber = () => {
  questionCounter++;
  return questionCounter;
};
let textboxCounter = 0;
const resetTextboxCounter = () => {
  textboxCounter = 0;
};
const renderTextBox = (heading, text) => {
  textboxCounter++;
  const textareaId = `textbox-${textboxCounter}`;
  return `<div class="text-box">
  <h4>${escapeHtmlText(heading)}</h4>
  <div class="govuk-form-group">
    <label class="govuk-label" for="${textareaId}">
      ${escapeHtmlText(text)}
    </label>
    <textarea class="govuk-textarea user-input-area" id="${textareaId}" name="${textareaId}" rows="5"></textarea>
  </div>
</div>
`;
};
const addAnswer = (sectionHeading, question, subtext, answer, disagreeText, request) => {
  if (!answer) return "";
  questionCounter++;
  const radioName = `question-${questionCounter}`;
  const textareaId = `notes-${questionCounter}`;
  let html = '<div class="answer-section">\n';
  if (sectionHeading) {
    html += `  <h2>${escapeHtmlText(sectionHeading)}</h2>
`;
  }
  html += `  <h3 class="question">${escapeHtmlText(question)}</h3>
`;
  if (subtext) {
    html += `  <p class="hint">${escapeHtmlText(subtext)}</p>
`;
  }
  if (isPerChildAnswer(answer)) {
    html += renderPerChildAnswerHtml(answer);
  } else {
    html += `  <p class="answer">${escapeHtmlText(answer)}</p>
`;
  }
  html += `  <div class="do-you-agree">
`;
  html += `    <div class="govuk-form-group">
`;
  html += `      <fieldset class="govuk-fieldset">
`;
  html += `        <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
`;
  html += `          ${escapeHtmlText(request.__("sharePlan.yourProposedPlan.doYouAgree"))}
`;
  html += `        </legend>
`;
  html += `        <div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
`;
  html += `          <div class="govuk-checkboxes__item">
`;
  html += `            <input class="govuk-checkboxes__input" id="${radioName}-yes" name="${radioName}" type="checkbox" value="yes">
`;
  html += `            <label class="govuk-label govuk-checkboxes__label" for="${radioName}-yes">
`;
  html += `              ${escapeHtmlText(request.__("yes"))}
`;
  html += `            </label>
`;
  html += `          </div>
`;
  html += `          <div class="govuk-checkboxes__item">
`;
  html += `            <input class="govuk-checkboxes__input" id="${radioName}-no" name="${radioName}" type="checkbox" value="no">
`;
  html += `            <label class="govuk-label govuk-checkboxes__label" for="${radioName}-no">
`;
  html += `              ${escapeHtmlText(request.__("no"))}
`;
  html += `            </label>
`;
  html += `          </div>
`;
  html += `        </div>
`;
  html += `      </fieldset>
`;
  html += `    </div>
`;
  html += `  </div>
`;
  html += `  <div class="text-box">
`;
  html += `    <div class="govuk-form-group">
`;
  html += `      <label class="govuk-label" for="${textareaId}">
`;
  html += `        ${escapeHtmlText(disagreeText)}
`;
  html += `      </label>
`;
  html += `      <textarea class="govuk-textarea user-input-area" id="${textareaId}" name="${textareaId}" rows="5"></textarea>
`;
  html += `    </div>
`;
  html += `  </div>
`;
  html += "</div>\n";
  return html;
};
var addAnswer_default = addAnswer;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  escapeHtmlText,
  getNextQuestionNumber,
  isPerChildAnswer,
  renderPerChildAnswerHtml,
  renderTextBox,
  resetQuestionCounter,
  resetTextboxCounter
});
//# sourceMappingURL=addAnswer.js.map
