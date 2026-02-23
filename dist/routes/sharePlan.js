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
var sharePlan_exports = {};
__export(sharePlan_exports, {
  default: () => sharePlan_default
});
module.exports = __toCommonJS(sharePlan_exports);
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../utils/addCompletedStep"));
var import_formattedAnswersForPdf = require("../utils/formattedAnswersForPdf");
var import_sessionHelpers = require("../utils/sessionHelpers");
const sharePlanRoutes = (router) => {
  router.get(import_paths.default.SHARE_PLAN, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.SHARE_PLAN), (request, response) => {
    const childrenNames = (0, import_sessionHelpers.formattedChildrenNames)(request);
    (0, import_addCompletedStep.default)(request, import_formSteps.default.SHARE_PLAN);
    response.render("pages/sharePlan", {
      title: request.__("sharePlan.title", { names: childrenNames }),
      values: {
        ...request.session,
        childrenNames,
        parentNotMostlyLivedWith: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session),
        mostlyLiveAnswer: (0, import_formattedAnswersForPdf.mostlyLive)(request),
        whichScheduleAnswer: (0, import_formattedAnswersForPdf.whichSchedule)(request),
        willOvernightsHappenAnswer: (0, import_formattedAnswersForPdf.willOvernightsHappen)(request),
        whichDaysOvernightAnswer: (0, import_formattedAnswersForPdf.whichDaysOvernight)(request),
        willDaytimeVisitsHappenAnswer: (0, import_formattedAnswersForPdf.willDaytimeVisitsHappen)(request),
        whichDaysDaytimeVisitsAnswer: (0, import_formattedAnswersForPdf.whichDaysDaytimeVisits)(request),
        getBetweenHouseholdsAnswer: (0, import_formattedAnswersForPdf.getBetweenHouseholds)(request),
        whereHandoverAnswer: (0, import_formattedAnswersForPdf.whereHandover)(request),
        willChangeDuringSchoolHolidaysAnswer: (0, import_formattedAnswersForPdf.willChangeDuringSchoolHolidays)(request),
        howChangeDuringSchoolHolidaysAnswer: (0, import_formattedAnswersForPdf.howChangeDuringSchoolHolidays)(request),
        itemsForChangeoverAnswer: (0, import_formattedAnswersForPdf.itemsForChangeover)(request),
        whatWillHappenAnswer: (0, import_formattedAnswersForPdf.whatWillHappen)(request),
        whatOtherThingsMatterAnswer: (0, import_formattedAnswersForPdf.whatOtherThingsMatter)(request),
        planLastMinuteChanges: (0, import_formattedAnswersForPdf.planLastMinuteChanges)(request),
        planLongTermNotice: (0, import_formattedAnswersForPdf.planLongTermNotice)(request),
        planReview: (0, import_formattedAnswersForPdf.planReview)(request)
      }
    });
  });
};
var sharePlan_default = sharePlanRoutes;
//# sourceMappingURL=sharePlan.js.map
