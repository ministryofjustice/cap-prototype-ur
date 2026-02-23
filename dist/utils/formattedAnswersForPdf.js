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
var formattedAnswersForPdf_exports = {};
__export(formattedAnswersForPdf_exports, {
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
module.exports = __toCommonJS(formattedAnswersForPdf_exports);
var import_formValueUtils = require("./formValueUtils");
var import_perChildSession = require("./perChildSession");
var import_sessionHelpers = require("./sessionHelpers");
const mostlyLive = (request) => {
  const { initialAdultName, secondaryAdultName, namesOfChildren } = request.session;
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.mostlyLive) return void 0;
  const data = livingAndVisiting.mostlyLive;
  const formatAnswer = (answer, context = "default", childName) => {
    if (!answer?.where) return void 0;
    const suffix = context === "child" ? "Child" : context === "other" ? "OtherChildren" : "";
    switch (answer.where) {
      case "withInitial":
        return request.__(`sharePlan.yourProposedPlan.livingAndVisiting.suggestedLiveWith${suffix}`, {
          senderName: initialAdultName,
          adult: initialAdultName,
          childName
        });
      case "withSecondary":
        return request.__(`sharePlan.yourProposedPlan.livingAndVisiting.suggestedLiveWith${suffix}`, {
          senderName: initialAdultName,
          adult: secondaryAdultName,
          childName
        });
      case "split":
        return request.__(`sharePlan.yourProposedPlan.livingAndVisiting.suggestedSplit${suffix}`, {
          senderName: initialAdultName,
          otherAdult: secondaryAdultName,
          childName
        });
      case "other":
        return request.__("sharePlan.yourProposedPlan.senderSuggested", {
          senderName: initialAdultName,
          suggestion: answer.describeArrangement
        });
      default:
        return void 0;
    }
  };
  if (data.where !== void 0 && data.default === void 0) {
    return formatAnswer(data);
  }
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return formatAnswer(data.default) || "";
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.where).map(([childIndex, answer]) => {
    const childName = namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`;
    return {
      childName,
      answer: formatAnswer(answer, "child", childName) || ""
    };
  }).filter((item) => item.answer);
  const defaultAnswer = formatAnswer(data.default, perChildAnswers.length > 0 ? "other" : "default") || "";
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const whichSchedule = (request) => {
  const { initialAdultName, namesOfChildren } = request.session;
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.whichSchedule) return void 0;
  const data = livingAndVisiting.whichSchedule;
  const formatAnswer = (answer) => {
    if (!answer) return void 0;
    if (answer.noDecisionRequired) {
      return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
    }
    if (answer.answer) {
      return request.__("sharePlan.yourProposedPlan.senderSuggested", {
        senderName: initialAdultName,
        suggestion: answer.answer
      });
    }
    return void 0;
  };
  if (data.noDecisionRequired !== void 0 && data.default === void 0) {
    return data.noDecisionRequired ? request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName }) : request.__("sharePlan.yourProposedPlan.senderSuggested", {
      senderName: initialAdultName,
      suggestion: data.answer
    });
  }
  if (data.default?.noDecisionRequired) {
    return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
  }
  const defaultAnswer = formatAnswer(data.default) || "";
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return defaultAnswer;
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.answer && !answer.noDecisionRequired).map(([childIndex, answer]) => ({
    childName: namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`,
    answer: formatAnswer(answer) || ""
  })).filter((item) => item.answer);
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const willOvernightsHappen = (request) => {
  const { initialAdultName } = request.session;
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.overnightVisits) return void 0;
  return livingAndVisiting.overnightVisits.willHappen ? request.__("sharePlan.yourProposedPlan.livingAndVisiting.suggestedStayOvernight", {
    senderName: initialAdultName,
    adult: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session)
  }) : request.__("sharePlan.yourProposedPlan.livingAndVisiting.suggestedNoOvernights", {
    senderName: initialAdultName
  });
};
const whichDaysOvernight = (request) => {
  const { initialAdultName } = request.session;
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.overnightVisits?.whichDays) return void 0;
  if (livingAndVisiting.overnightVisits.whichDays.describeArrangement) {
    return request.__("sharePlan.yourProposedPlan.senderSuggested", {
      senderName: initialAdultName,
      suggestion: livingAndVisiting.overnightVisits.whichDays.describeArrangement
    });
  }
  if (livingAndVisiting.overnightVisits.whichDays.noDecisionRequired) {
    return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
  }
  return request.__("sharePlan.yourProposedPlan.livingAndVisiting.suggestedOvernightDays", {
    senderName: initialAdultName,
    days: (0, import_formValueUtils.formatWhichDaysSessionValue)(livingAndVisiting.overnightVisits.whichDays, request)
  });
};
const willDaytimeVisitsHappen = (request) => {
  const { initialAdultName } = request.session;
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.daytimeVisits) return void 0;
  return livingAndVisiting.daytimeVisits.willHappen ? request.__("sharePlan.yourProposedPlan.livingAndVisiting.suggestedDaytimeVisits", {
    senderName: initialAdultName,
    adult: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session)
  }) : request.__("sharePlan.yourProposedPlan.livingAndVisiting.suggestedNoDaytimeVisits", {
    senderName: initialAdultName
  });
};
const whichDaysDaytimeVisits = (request) => {
  const { initialAdultName } = request.session;
  const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
  if (!livingAndVisiting?.daytimeVisits?.whichDays) return void 0;
  if (livingAndVisiting.daytimeVisits.whichDays.describeArrangement) {
    return request.__("sharePlan.yourProposedPlan.senderSuggested", {
      senderName: initialAdultName,
      suggestion: livingAndVisiting.daytimeVisits.whichDays.describeArrangement
    });
  }
  if (livingAndVisiting.daytimeVisits?.whichDays.noDecisionRequired) {
    return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
  }
  return request.__("sharePlan.yourProposedPlan.livingAndVisiting.suggestedDaytimeVisitDays", {
    senderName: initialAdultName,
    days: (0, import_formValueUtils.formatWhichDaysSessionValue)(livingAndVisiting.daytimeVisits.whichDays, request)
  });
};
const getBetweenHouseholds = (request) => {
  const { initialAdultName, secondaryAdultName, namesOfChildren } = request.session;
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays");
  if (!handoverAndHolidays?.getBetweenHouseholds) return void 0;
  const data = handoverAndHolidays.getBetweenHouseholds;
  const formatAnswer = (answer, context = "default", childName) => {
    if (!answer) return void 0;
    if (answer.noDecisionRequired) {
      return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
    }
    const suffix = context === "child" ? "Child" : context === "other" ? "OtherChildren" : "";
    switch (answer.how) {
      case "initialCollects":
        return request.__(`sharePlan.yourProposedPlan.handoverAndHolidays.suggestedCollects${suffix}`, {
          senderName: initialAdultName,
          adult: initialAdultName,
          childName
        });
      case "secondaryCollects":
        return request.__(`sharePlan.yourProposedPlan.handoverAndHolidays.suggestedCollects${suffix}`, {
          senderName: initialAdultName,
          adult: secondaryAdultName,
          childName
        });
      case "other":
        return request.__("sharePlan.yourProposedPlan.senderSuggested", {
          senderName: initialAdultName,
          suggestion: answer.describeArrangement
        });
      default:
        return void 0;
    }
  };
  if (data.how !== void 0 && data.default === void 0) {
    return formatAnswer(data);
  }
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return formatAnswer(data.default) || "";
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.how || answer.noDecisionRequired).map(([childIndex, answer]) => {
    const childName = namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`;
    return {
      childName,
      answer: formatAnswer(answer, "child", childName) || ""
    };
  }).filter((item) => item.answer);
  const defaultAnswer = formatAnswer(data.default, perChildAnswers.length > 0 ? "other" : "default") || "";
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
  const formatAnswer = (answer, context = "default", childName) => {
    if (!answer) return void 0;
    if (answer.noDecisionRequired) {
      return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
    }
    if (answer.someoneElse) {
      return request.__("sharePlan.yourProposedPlan.handoverAndHolidays.suggestedSomeoneElse", {
        senderName: initialAdultName,
        someoneElse: answer.someoneElse
      });
    }
    if (!answer.where) return void 0;
    const getAnswerForWhereHandoverWhere = (where) => {
      switch (where) {
        case "neutral":
          return request.__("sharePlan.yourProposedPlan.handoverAndHolidays.neutralLocation");
        case "initialHome":
          return request.__("sharePlan.yourProposedPlan.handoverAndHolidays.home", { adult: initialAdultName });
        case "secondaryHome":
          return request.__("sharePlan.yourProposedPlan.handoverAndHolidays.home", { adult: secondaryAdultName });
        case "school":
          return request.__("sharePlan.yourProposedPlan.handoverAndHolidays.school");
        default:
          return void 0;
      }
    };
    const suffix = context === "child" ? "Child" : context === "other" ? "OtherChildren" : "";
    return request.__(`sharePlan.yourProposedPlan.handoverAndHolidays.suggestedHandover${suffix}`, {
      senderName: initialAdultName,
      location: (0, import_formValueUtils.formatListOfStrings)(answer.where.map(getAnswerForWhereHandoverWhere), request),
      childName
    });
  };
  if (data.where !== void 0 && data.default === void 0) {
    return formatAnswer(data);
  }
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return formatAnswer(data.default) || "";
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.where || answer.noDecisionRequired).map(([childIndex, answer]) => {
    const childName = namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`;
    return {
      childName,
      answer: formatAnswer(answer, "child", childName) || ""
    };
  }).filter((item) => item.answer);
  const defaultAnswer = formatAnswer(data.default, perChildAnswers.length > 0 ? "other" : "default") || "";
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const willChangeDuringSchoolHolidays = (request) => {
  const { initialAdultName } = request.session;
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays");
  if (!handoverAndHolidays?.willChangeDuringSchoolHolidays) return void 0;
  if (handoverAndHolidays.willChangeDuringSchoolHolidays.noDecisionRequired) {
    return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
  }
  return handoverAndHolidays.willChangeDuringSchoolHolidays.willChange ? request.__("sharePlan.yourProposedPlan.handoverAndHolidays.suggestedChangeDuringSchoolHolidays", {
    senderName: initialAdultName
  }) : request.__("sharePlan.yourProposedPlan.handoverAndHolidays.suggestedNoChangeDuringSchoolHolidays", {
    senderName: initialAdultName
  });
};
const howChangeDuringSchoolHolidays = (request) => {
  const { initialAdultName, namesOfChildren } = request.session;
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays");
  if (!handoverAndHolidays?.howChangeDuringSchoolHolidays) return void 0;
  const data = handoverAndHolidays.howChangeDuringSchoolHolidays;
  if (data.default?.noDecisionRequired) {
    return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
  }
  const defaultSuggestion = request.__("sharePlan.yourProposedPlan.senderSuggested", {
    senderName: initialAdultName,
    suggestion: data.default?.answer || ""
  });
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return defaultSuggestion;
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.answer && !answer.noDecisionRequired).map(([childIndex, answer]) => ({
    childName: namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`,
    answer: request.__("sharePlan.yourProposedPlan.senderSuggested", {
      senderName: initialAdultName,
      suggestion: answer.answer
    })
  }));
  return {
    defaultAnswer: defaultSuggestion,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const itemsForChangeover = (request) => {
  const { initialAdultName } = request.session;
  const handoverAndHolidays = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays");
  if (!handoverAndHolidays?.itemsForChangeover) return void 0;
  const data = handoverAndHolidays.itemsForChangeover;
  if (data.default) {
    return data.default.noDecisionRequired ? request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName }) : request.__("sharePlan.yourProposedPlan.senderSuggested", {
      senderName: initialAdultName,
      suggestion: data.default.answer
    });
  }
  return data.noDecisionRequired ? request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName }) : request.__("sharePlan.yourProposedPlan.senderSuggested", {
    senderName: initialAdultName,
    suggestion: data.answer
  });
};
const whatWillHappen = (request) => {
  const { initialAdultName, namesOfChildren } = request.session;
  const specialDays = (0, import_perChildSession.getSessionValue)(request.session, "specialDays");
  if (!specialDays?.whatWillHappen) return void 0;
  const data = specialDays.whatWillHappen;
  const formatAnswer = (answer) => {
    if (!answer) return void 0;
    if (answer.noDecisionRequired) {
      return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
    }
    if (answer.answer) {
      return request.__("sharePlan.yourProposedPlan.senderSuggested", {
        senderName: initialAdultName,
        suggestion: answer.answer
      });
    }
    return void 0;
  };
  if (data.noDecisionRequired !== void 0 && data.default === void 0) {
    return data.noDecisionRequired ? request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName }) : request.__("sharePlan.yourProposedPlan.senderSuggested", {
      senderName: initialAdultName,
      suggestion: data.answer
    });
  }
  if (data.default?.noDecisionRequired) {
    return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
  }
  const defaultAnswer = formatAnswer(data.default) || "";
  if (!data.byChild || Object.keys(data.byChild).length === 0) {
    return defaultAnswer;
  }
  const perChildAnswers = Object.entries(data.byChild).filter(([_, answer]) => answer.answer && !answer.noDecisionRequired).map(([childIndex, answer]) => ({
    childName: namesOfChildren[parseInt(childIndex, 10)] || `Child ${parseInt(childIndex, 10) + 1}`,
    answer: formatAnswer(answer) || ""
  })).filter((item) => item.answer);
  return {
    defaultAnswer,
    perChildAnswers: perChildAnswers.length > 0 ? perChildAnswers : void 0
  };
};
const whatOtherThingsMatter = (request) => {
  const { initialAdultName } = request.session;
  const otherThings = (0, import_perChildSession.getSessionValue)(request.session, "otherThings");
  if (!otherThings?.whatOtherThingsMatter) return void 0;
  return otherThings.whatOtherThingsMatter.noDecisionRequired ? request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName }) : request.__("sharePlan.yourProposedPlan.senderSuggested", {
    senderName: initialAdultName,
    suggestion: otherThings.whatOtherThingsMatter.answer
  });
};
const planLastMinuteChanges = (request) => {
  const { initialAdultName } = request.session;
  const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking");
  if (!decisionMaking?.planLastMinuteChanges) return void 0;
  if (decisionMaking.planLastMinuteChanges.noDecisionRequired) {
    return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
  }
  if (decisionMaking.planLastMinuteChanges.options.includes("anotherArrangement")) {
    return request.__("sharePlan.yourProposedPlan.senderSuggested", {
      senderName: initialAdultName,
      suggestion: decisionMaking.planLastMinuteChanges.anotherArrangementDescription
    });
  }
  return request.__("sharePlan.yourProposedPlan.decisionMaking.planLastMinuteChanges.howChangesCommunicated", {
    senderName: initialAdultName,
    methods: (0, import_formValueUtils.formatPlanChangesOptionsIntoList)(request)
  });
};
const planLongTermNotice = (request) => {
  const { initialAdultName } = request.session;
  const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking");
  if (!decisionMaking?.planLongTermNotice) return void 0;
  if (decisionMaking.planLongTermNotice.noDecisionRequired) {
    return request.__("sharePlan.yourProposedPlan.senderSuggestedDoNotDecide", { senderName: initialAdultName });
  }
  if (decisionMaking.planLongTermNotice.otherAnswer) {
    return request.__("sharePlan.yourProposedPlan.senderSuggested", {
      senderName: initialAdultName,
      suggestion: decisionMaking.planLongTermNotice.otherAnswer
    });
  }
  return request.__("sharePlan.yourProposedPlan.decisionMaking.planLongTermNotice.howChangesCommunicated", {
    senderName: initialAdultName,
    numberOfWeeks: decisionMaking.planLongTermNotice.weeks.toString()
  });
};
const planReview = (request) => {
  const { initialAdultName } = request.session;
  const decisionMaking = (0, import_perChildSession.getSessionValue)(request.session, "decisionMaking");
  if (!decisionMaking?.planReview) return void 0;
  let number;
  let translationName;
  if (decisionMaking.planReview.months) {
    number = decisionMaking.planReview.months;
    translationName = "sharePlan.yourProposedPlan.decisionMaking.planReview.suggestedMonths";
  } else {
    number = decisionMaking.planReview.years;
    translationName = "sharePlan.yourProposedPlan.decisionMaking.planReview.suggestedYears";
  }
  const translationSuffix = number === 1 ? "Singular" : "Plural";
  return request.__(translationName + translationSuffix, {
    senderName: initialAdultName,
    number: number.toString()
  });
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
//# sourceMappingURL=formattedAnswersForPdf.js.map
