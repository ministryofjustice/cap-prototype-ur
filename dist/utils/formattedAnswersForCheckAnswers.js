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
var formattedAnswersForCheckAnswers_exports = {};
__export(formattedAnswersForCheckAnswers_exports, {
  getBetweenHouseholds: () => getBetweenHouseholds,
  howChangeDuringSchoolHolidays: () => howChangeDuringSchoolHolidays,
  itemsForChangeover: () => itemsForChangeover,
  mostlyLive: () => mostlyLive,
  planLastMinuteChanges: () => planLastMinuteChanges,
  planLongTermNotice: () => planLongTermNotice,
  planReview: () => planReview,
  whatOtherThingsMatter: () => whatOtherThingsMatter,
  whatWillHappen: () => whatWillHappen,
  whereHandover: () => whereHandover,
  whichDaysDaytimeVisits: () => whichDaysDaytimeVisits,
  whichDaysOvernight: () => whichDaysOvernight,
  whichSchedule: () => whichSchedule,
  willChangeDuringSchoolHolidays: () => willChangeDuringSchoolHolidays,
  willDaytimeVisitsHappen: () => willDaytimeVisitsHappen,
  willOvernightsHappen: () => willOvernightsHappen
});
module.exports = __toCommonJS(formattedAnswersForCheckAnswers_exports);
var import_formValueUtils = require("./formValueUtils");
var import_perChildSession = require("./perChildSession");
var import_sessionHelpers = require("./sessionHelpers");
const mostlyLive = (request) => {
  const { initialAdultName, secondaryAdultName, namesOfChildren } = request.session;
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.mostlyLive) return void 0;
  const data = livingAndVisiting.mostlyLive;
  const formatAnswer = (answer) => {
    if (!answer?.where) return void 0;
    switch (answer.where) {
      case "withInitial":
        return request.__("livingAndVisiting.mostlyLive.with", { adult: initialAdultName });
      case "withSecondary":
        return request.__("livingAndVisiting.mostlyLive.with", { adult: secondaryAdultName });
      case "split":
        return request.__("livingAndVisiting.mostlyLive.split", {
          initialAdult: initialAdultName,
          secondaryAdult: secondaryAdultName
        });
      case "other":
        return answer.describeArrangement;
      default:
        return void 0;
    }
  };
  if (data.where !== void 0 && data.default === void 0) {
    return formatAnswer(data);
  }
  const defaultAnswer = formatAnswer(data.default) || "";
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return defaultAnswer;
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.where).map(([childIndex, answer]) => ({
    childName: namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`,
    answer: formatAnswer(answer) || ""
  })).filter((item) => item.answer);
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const whichSchedule = (request) => {
  const { namesOfChildren } = request.session;
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.whichSchedule) return void 0;
  const data = livingAndVisiting.whichSchedule;
  if (data.noDecisionRequired !== void 0 && data.default === void 0) {
    return data.noDecisionRequired ? request.__("doNotNeedToDecide") : data.answer;
  }
  if (data.default?.noDecisionRequired) {
    return request.__("doNotNeedToDecide");
  }
  const defaultAnswer = data.default?.answer || "";
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return defaultAnswer;
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.answer && !answer.noDecisionRequired).map(([childIndex, answer]) => ({
    childName: namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`,
    answer: answer.answer
  }));
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const willOvernightsHappen = (request) => {
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.overnightVisits) return void 0;
  return livingAndVisiting.overnightVisits.willHappen ? request.__("yes") : request.__("no");
};
const whichDaysOvernight = (request) => {
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.overnightVisits?.whichDays) return void 0;
  if (livingAndVisiting.overnightVisits.whichDays.describeArrangement) {
    return livingAndVisiting.overnightVisits.whichDays.describeArrangement;
  }
  if (livingAndVisiting.overnightVisits.whichDays.noDecisionRequired) {
    return request.__("doNotNeedToDecide");
  }
  return request.__("checkYourAnswers.livingAndVisiting.whichDaysOvernight", {
    adult: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session),
    days: (0, import_formValueUtils.formatWhichDaysSessionValue)(livingAndVisiting.overnightVisits.whichDays, request)
  });
};
const willDaytimeVisitsHappen = (request) => {
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.daytimeVisits) return void 0;
  return livingAndVisiting.daytimeVisits.willHappen ? request.__("yes") : request.__("no");
};
const whichDaysDaytimeVisits = (request) => {
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.daytimeVisits?.whichDays) return void 0;
  if (livingAndVisiting.daytimeVisits.whichDays.describeArrangement) {
    return livingAndVisiting.daytimeVisits?.whichDays.describeArrangement;
  }
  if (livingAndVisiting.daytimeVisits?.whichDays.noDecisionRequired) {
    return request.__("doNotNeedToDecide");
  }
  return request.__("checkYourAnswers.livingAndVisiting.whichDaysDaytimeVisits", {
    adult: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session),
    days: (0, import_formValueUtils.formatWhichDaysSessionValue)(livingAndVisiting.daytimeVisits.whichDays, request)
  });
};
const getBetweenHouseholds = (request) => {
  const { initialAdultName, secondaryAdultName, namesOfChildren } = request.session;
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays");
  if (!handoverAndHolidays?.getBetweenHouseholds) return void 0;
  const data = handoverAndHolidays.getBetweenHouseholds;
  const formatAnswer = (answer) => {
    if (!answer) return void 0;
    if (answer.noDecisionRequired) {
      return request.__("doNotNeedToDecide");
    }
    switch (answer.how) {
      case "initialCollects":
        return request.__("handoverAndHolidays.getBetweenHouseholds.collectsTheChildren", { adult: initialAdultName });
      case "secondaryCollects":
        return request.__("handoverAndHolidays.getBetweenHouseholds.collectsTheChildren", { adult: secondaryAdultName });
      case "other":
        return answer.describeArrangement;
      default:
        return void 0;
    }
  };
  if (data.how !== void 0 && data.default === void 0) {
    return formatAnswer(data);
  }
  const defaultAnswer = formatAnswer(data.default) || "";
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return defaultAnswer;
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.how || answer.noDecisionRequired).map(([childIndex, answer]) => ({
    childName: namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`,
    answer: formatAnswer(answer) || ""
  })).filter((item) => item.answer);
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const whereHandover = (request) => {
  const { initialAdultName, secondaryAdultName, namesOfChildren } = request.session;
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays");
  if (!handoverAndHolidays?.whereHandover) return void 0;
  const data = handoverAndHolidays.whereHandover;
  const formatAnswer = (answer) => {
    if (!answer) return void 0;
    if (answer.noDecisionRequired) {
      return request.__("doNotNeedToDecide");
    }
    if (!answer.where) return void 0;
    const getAnswerForWhereHandoverWhere = (where) => {
      switch (where) {
        case "neutral":
          return request.__("handoverAndHolidays.whereHandover.neutralLocation");
        case "initialHome":
          return request.__("handoverAndHolidays.whereHandover.atHome", { adult: initialAdultName });
        case "secondaryHome":
          return request.__("handoverAndHolidays.whereHandover.atHome", { adult: secondaryAdultName });
        case "school":
          return request.__("handoverAndHolidays.whereHandover.atSchool");
        case "someoneElse":
          return answer.someoneElse;
        default:
          return void 0;
      }
    };
    return answer.where.map(getAnswerForWhereHandoverWhere).join(", ");
  };
  if (data.where !== void 0 && data.default === void 0) {
    return formatAnswer(data);
  }
  const defaultAnswer = formatAnswer(data.default) || "";
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return defaultAnswer;
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.where || answer.noDecisionRequired).map(([childIndex, answer]) => ({
    childName: namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`,
    answer: formatAnswer(answer) || ""
  })).filter((item) => item.answer);
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const willChangeDuringSchoolHolidays = (request) => {
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays");
  if (!handoverAndHolidays?.willChangeDuringSchoolHolidays) return void 0;
  if (handoverAndHolidays.willChangeDuringSchoolHolidays.noDecisionRequired) {
    return request.__("doNotNeedToDecide");
  }
  return handoverAndHolidays.willChangeDuringSchoolHolidays.willChange ? request.__("yes") : request.__("no");
};
const howChangeDuringSchoolHolidays = (request) => {
  const { handoverAndHolidays, namesOfChildren } = request.session;
  if (!handoverAndHolidays.howChangeDuringSchoolHolidays) return void 0;
  const data = handoverAndHolidays.howChangeDuringSchoolHolidays;
  if (data.default?.noDecisionRequired) {
    return request.__("doNotNeedToDecide");
  }
  const defaultAnswer = data.default?.answer || "";
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return defaultAnswer;
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.answer && !answer.noDecisionRequired).map(([childIndex, answer]) => ({
    childName: namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`,
    answer: answer.answer
  }));
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const itemsForChangeover = (request) => {
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays");
  if (!handoverAndHolidays?.itemsForChangeover) return void 0;
  return handoverAndHolidays.itemsForChangeover.noDecisionRequired ? request.__("doNotNeedToDecide") : handoverAndHolidays.itemsForChangeover.answer;
};
const whatWillHappen = (request) => {
  const { namesOfChildren } = request.session;
  const specialDays = (0, import_perChildSession.getSessionValue)(request.session, "specialDays");
  if (!specialDays?.whatWillHappen) return void 0;
  const data = specialDays.whatWillHappen;
  if (data.noDecisionRequired !== void 0 && data.default === void 0) {
    return data.noDecisionRequired ? request.__("doNotNeedToDecide") : data.answer;
  }
  if (data.default?.noDecisionRequired) {
    return request.__("doNotNeedToDecide");
  }
  const defaultAnswer = data.default?.answer || "";
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return defaultAnswer;
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.answer && !answer.noDecisionRequired).map(([childIndex, answer]) => ({
    childName: namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`,
    answer: answer.answer
  }));
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const whatOtherThingsMatter = (request) => {
  const otherThings = (0, import_perChildSession.getSessionValue)(request.session, "otherThings");
  if (!otherThings?.whatOtherThingsMatter) return void 0;
  return otherThings.whatOtherThingsMatter.noDecisionRequired ? request.__("doNotNeedToDecide") : otherThings.whatOtherThingsMatter.answer;
};
const planLastMinuteChanges = (request) => {
  const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking");
  if (!decisionMaking?.planLastMinuteChanges) return void 0;
  if (decisionMaking.planLastMinuteChanges.noDecisionRequired) {
    return request.__("doNotNeedToDecide");
  }
  if (decisionMaking.planLastMinuteChanges.anotherArrangementDescription) {
    return decisionMaking.planLastMinuteChanges.anotherArrangementDescription;
  }
  const planLastMinuteChangeList = (0, import_formValueUtils.formatPlanChangesOptionsIntoList)(request);
  return planLastMinuteChangeList.charAt(0).toUpperCase() + String(planLastMinuteChangeList).slice(1);
};
const planLongTermNotice = (request) => {
  const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking");
  if (!decisionMaking?.planLongTermNotice) return void 0;
  if (decisionMaking.planLongTermNotice.noDecisionRequired) {
    return request.__("doNotNeedToDecide");
  }
  if (decisionMaking.planLongTermNotice.otherAnswer) {
    return decisionMaking.planLongTermNotice.otherAnswer;
  }
  return request.__("decisionMaking.planLongTermNotice.weeks", {
    number: decisionMaking.planLongTermNotice.weeks.toString()
  });
};
const planReview = (request) => {
  const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking");
  if (!decisionMaking?.planReview) return void 0;
  let number;
  let translationName;
  if (decisionMaking.planReview.months) {
    number = decisionMaking.planReview.months;
    translationName = "checkYourAnswers.decisionMaking.months";
  } else {
    number = decisionMaking.planReview.years;
    translationName = "checkYourAnswers.decisionMaking.years";
  }
  const translationSuffix = number === 1 ? "Singular" : "Plural";
  return request.__(translationName + translationSuffix, { number: number.toString() });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBetweenHouseholds,
  howChangeDuringSchoolHolidays,
  itemsForChangeover,
  mostlyLive,
  planLastMinuteChanges,
  planLongTermNotice,
  planReview,
  whatOtherThingsMatter,
  whatWillHappen,
  whereHandover,
  whichDaysDaytimeVisits,
  whichDaysOvernight,
  whichSchedule,
  willChangeDuringSchoolHolidays,
  willDaytimeVisitsHappen,
  willOvernightsHappen
});
//# sourceMappingURL=formattedAnswersForCheckAnswers.js.map
