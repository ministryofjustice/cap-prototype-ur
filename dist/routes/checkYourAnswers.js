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
var checkYourAnswers_exports = {};
__export(checkYourAnswers_exports, {
  default: () => checkYourAnswers_default
});
module.exports = __toCommonJS(checkYourAnswers_exports);
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../utils/addCompletedStep"));
var import_formattedAnswersForCheckAnswers = require("../utils/formattedAnswersForCheckAnswers");
var import_formValueUtils = require("../utils/formValueUtils");
var import_sessionHelpers = require("../utils/sessionHelpers");
const checkYourAnswersRoutes = (router) => {
  router.get(import_paths.default.CHECK_YOUR_ANSWERS, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.CHECK_YOUR_ANSWERS), (request, response) => {
    const { initialAdultName, secondaryAdultName, numberOfChildren } = request.session;
    (0, import_addCompletedStep.default)(request, import_formSteps.default.CHECK_YOUR_ANSWERS);
    response.render("pages/checkYourAnswers", {
      title: request.__("checkYourAnswers.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.TASK_LIST),
      values: {
        numberOfChildren,
        childrenNames: (0, import_sessionHelpers.formattedChildrenNames)(request),
        adultNames: (0, import_formValueUtils.formatListOfStrings)([initialAdultName, secondaryAdultName], request),
        parentNotMostlyLivedWith: (0, import_sessionHelpers.parentNotMostlyLivedWith)(request.session),
        mostlyLive: (0, import_formattedAnswersForCheckAnswers.mostlyLive)(request),
        whichSchedule: (0, import_formattedAnswersForCheckAnswers.whichSchedule)(request),
        willOvernightsHappen: (0, import_formattedAnswersForCheckAnswers.willOvernightsHappen)(request),
        whichDaysOvernight: (0, import_formattedAnswersForCheckAnswers.whichDaysOvernight)(request),
        willDaytimeVisitsHappen: (0, import_formattedAnswersForCheckAnswers.willDaytimeVisitsHappen)(request),
        whichDaysDaytimeVisits: (0, import_formattedAnswersForCheckAnswers.whichDaysDaytimeVisits)(request),
        getBetweenHouseholds: (0, import_formattedAnswersForCheckAnswers.getBetweenHouseholds)(request),
        whereHandover: (0, import_formattedAnswersForCheckAnswers.whereHandover)(request),
        willChangeDuringSchoolHolidays: (0, import_formattedAnswersForCheckAnswers.willChangeDuringSchoolHolidays)(request),
        howChangeDuringSchoolHolidays: (0, import_formattedAnswersForCheckAnswers.howChangeDuringSchoolHolidays)(request),
        itemsForChangeover: (0, import_formattedAnswersForCheckAnswers.itemsForChangeover)(request),
        whatWillHappen: (0, import_formattedAnswersForCheckAnswers.whatWillHappen)(request),
        whatOtherThingsMatter: (0, import_formattedAnswersForCheckAnswers.whatOtherThingsMatter)(request),
        planLastMinuteChanges: (0, import_formattedAnswersForCheckAnswers.planLastMinuteChanges)(request),
        planLongTermNotice: (0, import_formattedAnswersForCheckAnswers.planLongTermNotice)(request),
        planReview: (0, import_formattedAnswersForCheckAnswers.planReview)(request)
      }
    });
  });
};
var checkYourAnswers_default = checkYourAnswersRoutes;
//# sourceMappingURL=checkYourAnswers.js.map
