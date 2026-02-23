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
var createHtmlContent_exports = {};
__export(createHtmlContent_exports, {
  default: () => createHtmlContent_default
});
module.exports = __toCommonJS(createHtmlContent_exports);
var import_addAnswer = require("./addAnswer");
var import_addDecisionMaking = __toESM(require("./addDecisionMaking"));
var import_addHandoverAndHolidays = __toESM(require("./addHandoverAndHolidays"));
var import_addLivingAndVisiting = __toESM(require("./addLivingAndVisiting"));
var import_addOtherThings = __toESM(require("./addOtherThings"));
var import_addSpecialDays = __toESM(require("./addSpecialDays"));
var import_addWhatHappensNow = __toESM(require("./addWhatHappensNow"));
const createHtmlContent = (request) => {
  (0, import_addAnswer.resetQuestionCounter)();
  (0, import_addAnswer.resetTextboxCounter)();
  let html = "";
  html += (0, import_addLivingAndVisiting.default)(request);
  html += (0, import_addHandoverAndHolidays.default)(request);
  html += (0, import_addSpecialDays.default)(request);
  html += (0, import_addOtherThings.default)(request);
  html += (0, import_addDecisionMaking.default)(request);
  html += (0, import_addWhatHappensNow.default)(request);
  return html;
};
var createHtmlContent_default = createHtmlContent;
//# sourceMappingURL=createHtmlContent.js.map
