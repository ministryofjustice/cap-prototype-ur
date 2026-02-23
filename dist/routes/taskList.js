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
var taskList_exports = {};
__export(taskList_exports, {
  default: () => taskList_default
});
module.exports = __toCommonJS(taskList_exports);
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../utils/addCompletedStep"));
var import_sessionHelpers = require("../utils/sessionHelpers");
const isChildPlanComplete = (plan) => {
  if (!plan) return false;
  const hasLivingAndVisiting = !!plan.livingAndVisiting?.mostlyLive;
  const hasHandover = !!plan.handoverAndHolidays?.getBetweenHouseholds;
  const hasWhereHandover = !!plan.handoverAndHolidays?.whereHandover;
  const hasSchoolHolidays = !!plan.handoverAndHolidays?.willChangeDuringSchoolHolidays || !!plan.handoverAndHolidays?.howChangeDuringSchoolHolidays;
  const hasItems = !!plan.handoverAndHolidays?.itemsForChangeover;
  const hasSpecialDays = !!plan.specialDays?.whatWillHappen;
  const hasOtherThings = !!plan.otherThings?.whatOtherThingsMatter;
  const hasDecisionMaking = !!plan.decisionMaking?.planLastMinuteChanges && !!plan.decisionMaking?.planLongTermNotice && !!plan.decisionMaking?.planReview;
  return hasLivingAndVisiting && hasHandover && hasWhereHandover && hasSchoolHolidays && hasItems && hasSpecialDays && hasOtherThings && hasDecisionMaking;
};
const taskListRoutes = (router) => {
  router.get(import_paths.default.TASK_LIST, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.TASK_LIST), (request, response) => {
    const { numberOfChildren, namesOfChildren, perChildDesignMode, currentChildIndex, childPlans } = request.session;
    const designMode = perChildDesignMode || "design1";
    const isDesign2Mode = designMode === "design2" && numberOfChildren > 1;
    const isDesign3Mode = designMode === "design3";
    const isDesign4Mode = designMode === "design4";
    const isMostlyLiveComplete = (0, import_sessionHelpers.mostlyLiveComplete)(request.session);
    const isGetBetweenHouseholdsComplete = (0, import_sessionHelpers.getBetweenHouseholdsComplete)(request.session);
    const isWhereHandoverComplete = (0, import_sessionHelpers.whereHandoverComplete)(request.session);
    const isWillChangeDuringSchoolHolidaysComplete = (0, import_sessionHelpers.willChangeDuringSchoolHolidaysComplete)(request.session);
    const isItemsForChangeoverComplete = (0, import_sessionHelpers.itemsForChangeoverComplete)(request.session);
    const isWhatWillHappenComplete = (0, import_sessionHelpers.whatWillHappenComplete)(request.session);
    const isWhatOtherThingsMatterComplete = (0, import_sessionHelpers.whatOtherThingsMatterComplete)(request.session);
    const isPlanLastMinuteChangesComplete = (0, import_sessionHelpers.planLastMinuteChangesComplete)(request.session);
    const isPlanLongTermNoticeComplete = (0, import_sessionHelpers.planLongTermNoticeComplete)(request.session);
    const isPlanReviewComplete = (0, import_sessionHelpers.planReviewComplete)(request.session);
    (0, import_addCompletedStep.default)(request, import_formSteps.default.TASK_LIST);
    let design2Data = {};
    if (isDesign2Mode) {
      let plans = childPlans || [];
      if (plans.length === 0) {
        plans = namesOfChildren.map((name, index) => ({
          childIndex: index,
          childName: name,
          isComplete: false
        }));
        request.session.childPlans = plans;
      }
      const activeChildIndex = currentChildIndex !== void 0 && currentChildIndex < numberOfChildren ? currentChildIndex : 0;
      if (request.session.currentChildIndex !== activeChildIndex) {
        request.session.currentChildIndex = activeChildIndex;
      }
      const childPlanStatuses = plans.map((plan) => ({
        ...plan,
        isComplete: isChildPlanComplete(plan)
      }));
      const childrenWithData = plans.filter(
        (plan) => plan.livingAndVisiting || plan.handoverAndHolidays || plan.specialDays || plan.otherThings || plan.decisionMaking
      );
      design2Data = {
        isDesign2: true,
        currentChildIndex: activeChildIndex,
        currentChildName: namesOfChildren[activeChildIndex],
        childPlanStatuses,
        childrenWithData,
        allChildrenComplete: childPlanStatuses.every((p) => p.isComplete)
      };
    }
    const allTasksComplete = isWhatWillHappenComplete && isMostlyLiveComplete && isGetBetweenHouseholdsComplete && isWhereHandoverComplete && isWillChangeDuringSchoolHolidaysComplete && isItemsForChangeoverComplete && isWhatOtherThingsMatterComplete && isPlanLastMinuteChangesComplete && isPlanLongTermNoticeComplete && isPlanReviewComplete;
    const showContinueButton = isDesign2Mode ? allTasksComplete && design2Data.allChildrenComplete : allTasksComplete;
    response.render("pages/taskList", {
      title: request.__("taskList.title", { names: (0, import_sessionHelpers.formattedChildrenNames)(request) }),
      // Design mode toggle - hidden for now, keeping Design 1 as the default
      designMode,
      designModeLabel: designMode === "design1" ? "Design 1: Answer for all, then specify per child (dropdown)" : designMode === "design2" ? "Design 2: Answer for each child separately" : designMode === "design3" ? "Design 3: Answer once, then specify per child" : designMode === "design4" ? "Design 4: Answer for all, then specify per child (checkboxes)" : null,
      showDesignToggle: false,
      numberOfChildren,
      namesOfChildren,
      // This should only be true when all tasks are complete
      showContinue: showContinueButton,
      mostlyLiveComplete: isMostlyLiveComplete,
      getBetweenHouseholdsComplete: isGetBetweenHouseholdsComplete,
      whereHandoverComplete: isWhereHandoverComplete,
      willChangeDuringSchoolHolidaysComplete: isWillChangeDuringSchoolHolidaysComplete,
      itemsForChangeoverComplete: isItemsForChangeoverComplete,
      whatWillHappenComplete: isWhatWillHappenComplete,
      whatOtherThingsMatterComplete: isWhatOtherThingsMatterComplete,
      planLastMinuteChangesComplete: isPlanLastMinuteChangesComplete,
      planLongTermNoticeComplete: isPlanLongTermNoticeComplete,
      planReviewComplete: isPlanReviewComplete,
      // Design 2 specific data
      ...design2Data
    });
  });
};
var taskList_default = taskListRoutes;
//# sourceMappingURL=taskList.js.map
