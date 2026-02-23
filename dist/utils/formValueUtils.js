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
var formValueUtils_exports = {};
__export(formValueUtils_exports, {
  convertBooleanValueToRadioButtonValue: () => convertBooleanValueToRadioButtonValue,
  convertWhichDaysFieldToSessionValue: () => convertWhichDaysFieldToSessionValue,
  convertWhichDaysSessionValueToField: () => convertWhichDaysSessionValueToField,
  formatListOfStrings: () => formatListOfStrings,
  formatPlanChangesOptionsIntoList: () => formatPlanChangesOptionsIntoList,
  formatWhichDaysSessionValue: () => formatWhichDaysSessionValue
});
module.exports = __toCommonJS(formValueUtils_exports);
const formatListOfStrings = (words, request) => {
  switch (words.length) {
    case 0:
      return "";
    case 1:
      return words[0];
    case 2:
      return request.__("aAndB", { itemA: words[0], itemB: words[1] });
    default:
      return request.__("aAndB", { itemA: words.slice(0, -1).join(", "), itemB: words[words.length - 1] });
  }
};
const convertBooleanValueToRadioButtonValue = (booleanValue) => {
  switch (booleanValue) {
    case true:
      return "Yes";
    case false:
      return "No";
    default:
      return void 0;
  }
};
const convertWhichDaysFieldToSessionValue = (whichDays, describeArrangement) => {
  if (whichDays[0] === "other") {
    return { describeArrangement };
  }
  return { days: whichDays };
};
const convertWhichDaysSessionValueToField = (whichDays) => {
  if (whichDays?.describeArrangement) {
    return [["other"], whichDays.describeArrangement];
  }
  return [whichDays?.days, void 0];
};
const formatWhichDaysSessionValue = (whichDays, request) => {
  if (!whichDays?.days) {
    return "";
  }
  const days = convertWhichDaysSessionValueToField(whichDays)[0].map((day) => request.__(`days.${day}`));
  if (days.length === 1) {
    return request.__("aItem", { item: days[0] });
  }
  return formatListOfStrings(days, request);
};
const formatPlanChangesOptionsIntoList = (request) => {
  const translatedStrings = request.session.decisionMaking.planLastMinuteChanges.options.map((option) => request.__(`decisionMaking.planLastMinuteChanges.${option}`)).map((s) => s.toLowerCase());
  return formatListOfStrings(translatedStrings, request);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertBooleanValueToRadioButtonValue,
  convertWhichDaysFieldToSessionValue,
  convertWhichDaysSessionValueToField,
  formatListOfStrings,
  formatPlanChangesOptionsIntoList,
  formatWhichDaysSessionValue
});
//# sourceMappingURL=formValueUtils.js.map
