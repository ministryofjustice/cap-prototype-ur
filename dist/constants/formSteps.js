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
var formSteps_exports = {};
__export(formSteps_exports, {
  default: () => formSteps_default
});
module.exports = __toCommonJS(formSteps_exports);
const FORM_STEPS = {
  START: "start",
  SAFETY_CHECK: "safetyCheck",
  NOT_SAFE: "notSafe",
  CHILDREN_SAFETY_CHECK: "childrenSafetyCheck",
  CHILDREN_NOT_SAFE: "childrenNotSafe",
  DO_WHATS_BEST: "doWhatsBest",
  COURT_ORDER_CHECK: "courtOrderCheck",
  EXISTING_COURT_ORDER: "existingCourtOrder",
  NUMBER_OF_CHILDREN: "numberOfChildren",
  ABOUT_THE_CHILDREN: "aboutTheChildren",
  ABOUT_THE_ADULTS: "aboutTheAdults",
  TASK_LIST: "taskList",
  LIVING_VISITING_MOSTLY_LIVE: "livingAndVisitingMostlyLive",
  LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN: "livingAndVisitingWillOvernightsHappen",
  LIVING_VISITING_WHICH_DAYS_OVERNIGHT: "livingAndVisitingWhichDaysOvernight",
  LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN: "livingAndVisitingWillDaytimeVisitsHappen",
  LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS: "livingAndVisitingWhichDaysDaytimeVisits",
  LIVING_VISITING_WHICH_SCHEDULE: "livingAndVisitingWhichSchedule",
  HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS: "handoverHolidaysGetBetweenHouseholds",
  HANDOVER_HOLIDAYS_WHERE_HANDOVER: "handoverHolidaysWhereHandover",
  HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS: "handoverHolidaysWillChangeDuringSchoolHolidays",
  HANDOVER_HOLIDAYS_HOW_CHANGE_DURING_SCHOOL_HOLIDAYS: "handoverHolidaysHowChangeDuringSchoolHolidays",
  HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER: "handoverHolidaysItemsForChangeover",
  SPECIAL_DAYS_WHAT_WILL_HAPPEN: "specialDaysWhatWillHappen",
  OTHER_THINGS_WHAT_OTHER_THINGS_MATTER: "otherThingsWhatOtherThingsMatter",
  DECISION_MAKING_PLAN_LAST_MINUTE_CHANGES: "decisionMakingPlanLastMinuteChanges",
  DECISION_MAKING_PLAN_LONG_TERM_NOTICE: "decisionMakingPlanLongTermNotice",
  DECISION_MAKING_PLAN_REVIEW: "decisionMakingPlanReview",
  CHECK_YOUR_ANSWERS: "checkYourAnswers",
  SHARE_PLAN: "sharePlan",
  CONFIRMATION: "confirmation"
};
var formSteps_default = FORM_STEPS;
//# sourceMappingURL=formSteps.js.map
