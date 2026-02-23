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
var sessionHelpers_exports = {};
__export(sessionHelpers_exports, {
  formattedChildrenNames: () => formattedChildrenNames,
  getBackUrl: () => getBackUrl,
  getBetweenHouseholdsComplete: () => getBetweenHouseholdsComplete,
  getRedirectUrlAfterFormSubmit: () => getRedirectUrlAfterFormSubmit,
  itemsForChangeoverComplete: () => itemsForChangeoverComplete,
  mostlyLiveComplete: () => mostlyLiveComplete,
  parentMostlyLivedWith: () => parentMostlyLivedWith,
  parentNotMostlyLivedWith: () => parentNotMostlyLivedWith,
  planLastMinuteChangesComplete: () => planLastMinuteChangesComplete,
  planLongTermNoticeComplete: () => planLongTermNoticeComplete,
  planReviewComplete: () => planReviewComplete,
  whatOtherThingsMatterComplete: () => whatOtherThingsMatterComplete,
  whatWillHappenComplete: () => whatWillHappenComplete,
  whereHandoverComplete: () => whereHandoverComplete,
  willChangeDuringSchoolHolidaysComplete: () => willChangeDuringSchoolHolidaysComplete
});
module.exports = __toCommonJS(sessionHelpers_exports);
var import_formValueUtils = require("./formValueUtils");
var import_perChildSession = require("./perChildSession");
var import_redirectValidator = require("./redirectValidator");
const formattedChildrenNames = (request) => (0, import_formValueUtils.formatListOfStrings)(request.session.namesOfChildren, request);
const getMostlyLiveWhere = (mostlyLive) => {
  if (!mostlyLive) return void 0;
  if (mostlyLive.default?.where) return mostlyLive.default.where;
  return mostlyLive.where;
};
const parentMostlyLivedWith = (session) => {
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(session, "livingAndVisiting");
  const where = getMostlyLiveWhere(livingAndVisiting?.mostlyLive);
  return where === "withInitial" ? session.initialAdultName : session.secondaryAdultName;
};
const parentNotMostlyLivedWith = (session) => {
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(session, "livingAndVisiting");
  const where = getMostlyLiveWhere(livingAndVisiting?.mostlyLive);
  return where === "withInitial" ? session.secondaryAdultName : session.initialAdultName;
};
const mostlyLiveComplete = (session) => {
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(session, "livingAndVisiting");
  if (!livingAndVisiting?.mostlyLive) return false;
  const { mostlyLive, overnightVisits, daytimeVisits, whichSchedule } = livingAndVisiting;
  const where = getMostlyLiveWhere(mostlyLive);
  if (where === "other") {
    return true;
  }
  if (where === "split") {
    return !!whichSchedule;
  }
  const overnightComplete = overnightVisits?.willHappen !== void 0 && (!overnightVisits.willHappen || !!overnightVisits.whichDays);
  const daytimeVisitsComplete = daytimeVisits?.willHappen !== void 0 && (!daytimeVisits.willHappen || !!daytimeVisits.whichDays);
  return overnightComplete && daytimeVisitsComplete;
};
const getBetweenHouseholdsComplete = (session) => {
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(session, "handoverAndHolidays");
  return !!handoverAndHolidays?.getBetweenHouseholds;
};
const whereHandoverComplete = (session) => {
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(session, "handoverAndHolidays");
  return !!handoverAndHolidays?.whereHandover;
};
const willChangeDuringSchoolHolidaysComplete = (session) => {
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(session, "handoverAndHolidays");
  if (!handoverAndHolidays?.willChangeDuringSchoolHolidays) return false;
  return !(handoverAndHolidays.willChangeDuringSchoolHolidays.willChange && !handoverAndHolidays.howChangeDuringSchoolHolidays);
};
const itemsForChangeoverComplete = (session) => {
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(session, "handoverAndHolidays");
  return !!handoverAndHolidays?.itemsForChangeover;
};
const whatWillHappenComplete = (session) => {
  const specialDays = (0, import_perChildSession.getSessionValue)(session, "specialDays");
  return !!specialDays?.whatWillHappen;
};
const whatOtherThingsMatterComplete = (session) => {
  const otherThings = (0, import_perChildSession.getSessionValue)(session, "otherThings");
  return !!otherThings?.whatOtherThingsMatter;
};
const planLastMinuteChangesComplete = (session) => {
  const decisionMaking = (0, import_perChildSession.getSessionValue)(session, "decisionMaking");
  return !!decisionMaking?.planLastMinuteChanges;
};
const planLongTermNoticeComplete = (session) => {
  const decisionMaking = (0, import_perChildSession.getSessionValue)(session, "decisionMaking");
  return !!decisionMaking?.planLongTermNotice;
};
const planReviewComplete = (session) => {
  const decisionMaking = (0, import_perChildSession.getSessionValue)(session, "decisionMaking");
  return !!decisionMaking?.planReview;
};
const getBackUrl = (session, defaultUrl) => {
  if (!session.previousPage) {
    return defaultUrl;
  }
  return (0, import_redirectValidator.validateRedirectUrl)(session.previousPage, defaultUrl);
};
const getRedirectUrlAfterFormSubmit = (session, defaultUrl) => {
  const previousPage = session.previousPage;
  if (previousPage === "/check-your-answers") {
    return (0, import_redirectValidator.validateRedirectUrl)(previousPage, defaultUrl);
  }
  return defaultUrl;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formattedChildrenNames,
  getBackUrl,
  getBetweenHouseholdsComplete,
  getRedirectUrlAfterFormSubmit,
  itemsForChangeoverComplete,
  mostlyLiveComplete,
  parentMostlyLivedWith,
  parentNotMostlyLivedWith,
  planLastMinuteChangesComplete,
  planLongTermNoticeComplete,
  planReviewComplete,
  whatOtherThingsMatterComplete,
  whatWillHappenComplete,
  whereHandoverComplete,
  willChangeDuringSchoolHolidaysComplete
});
//# sourceMappingURL=sessionHelpers.js.map
