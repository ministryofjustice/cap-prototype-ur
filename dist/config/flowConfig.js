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
var flowConfig_exports = {};
__export(flowConfig_exports, {
  default: () => flowConfig_default
});
module.exports = __toCommonJS(flowConfig_exports);
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
const TASK_FLOW_MAP = {
  [import_formSteps.default.START]: {
    path: import_paths.default.START,
    dependsOn: []
  },
  [import_formSteps.default.SAFETY_CHECK]: {
    path: import_paths.default.SAFETY_CHECK,
    dependsOn: []
  },
  [import_formSteps.default.NOT_SAFE]: {
    path: import_paths.default.NOT_SAFE,
    dependsOn: [import_formSteps.default.SAFETY_CHECK]
  },
  [import_formSteps.default.CHILDREN_SAFETY_CHECK]: {
    path: import_paths.default.CHILDREN_SAFETY_CHECK,
    dependsOn: [import_formSteps.default.SAFETY_CHECK]
  },
  [import_formSteps.default.CHILDREN_NOT_SAFE]: {
    path: import_paths.default.CHILDREN_NOT_SAFE,
    dependsOn: [import_formSteps.default.CHILDREN_SAFETY_CHECK]
  },
  [import_formSteps.default.DO_WHATS_BEST]: {
    path: import_paths.default.DO_WHATS_BEST,
    dependsOn: [import_formSteps.default.CHILDREN_SAFETY_CHECK]
  },
  [import_formSteps.default.COURT_ORDER_CHECK]: {
    path: import_paths.default.COURT_ORDER_CHECK,
    dependsOn: [import_formSteps.default.DO_WHATS_BEST]
  },
  [import_formSteps.default.EXISTING_COURT_ORDER]: {
    path: import_paths.default.EXISTING_COURT_ORDER,
    dependsOn: [import_formSteps.default.COURT_ORDER_CHECK]
  },
  [import_formSteps.default.NUMBER_OF_CHILDREN]: {
    path: import_paths.default.NUMBER_OF_CHILDREN,
    dependsOn: [import_formSteps.default.COURT_ORDER_CHECK]
  },
  [import_formSteps.default.ABOUT_THE_CHILDREN]: {
    path: import_paths.default.ABOUT_THE_CHILDREN,
    dependsOn: [import_formSteps.default.NUMBER_OF_CHILDREN]
  },
  [import_formSteps.default.ABOUT_THE_ADULTS]: {
    path: import_paths.default.ABOUT_THE_ADULTS,
    dependsOn: [import_formSteps.default.ABOUT_THE_CHILDREN]
  },
  [import_formSteps.default.TASK_LIST]: {
    path: import_paths.default.TASK_LIST,
    dependsOn: [import_formSteps.default.ABOUT_THE_ADULTS]
  },
  [import_formSteps.default.LIVING_VISITING_MOSTLY_LIVE]: {
    path: import_paths.default.LIVING_VISITING_MOSTLY_LIVE,
    dependsOn: [import_formSteps.default.TASK_LIST]
  },
  [import_formSteps.default.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN]: {
    path: import_paths.default.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN,
    dependsOn: [import_formSteps.default.LIVING_VISITING_MOSTLY_LIVE]
  },
  [import_formSteps.default.LIVING_VISITING_WHICH_DAYS_OVERNIGHT]: {
    path: import_paths.default.LIVING_VISITING_WHICH_DAYS_OVERNIGHT,
    dependsOn: [import_formSteps.default.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN]
  },
  [import_formSteps.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN]: {
    path: import_paths.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN,
    dependsOn: [import_formSteps.default.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN]
  },
  [import_formSteps.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS]: {
    path: import_paths.default.LIVING_VISITING_WHICH_DAYS_DAYTIME_VISITS,
    dependsOn: [import_formSteps.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN]
  },
  [import_formSteps.default.LIVING_VISITING_WHICH_SCHEDULE]: {
    path: import_paths.default.LIVING_VISITING_WHICH_SCHEDULE,
    dependsOn: [import_formSteps.default.LIVING_VISITING_MOSTLY_LIVE]
  },
  [import_formSteps.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS]: {
    path: import_paths.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS,
    dependsOn: [import_formSteps.default.TASK_LIST]
  },
  [import_formSteps.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER]: {
    path: import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER,
    dependsOn: [import_formSteps.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS]
  },
  [import_formSteps.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS]: {
    path: import_paths.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS,
    dependsOn: [import_formSteps.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER]
  },
  [import_formSteps.default.HANDOVER_HOLIDAYS_HOW_CHANGE_DURING_SCHOOL_HOLIDAYS]: {
    path: import_paths.default.HANDOVER_HOLIDAYS_HOW_CHANGE_DURING_SCHOOL_HOLIDAYS,
    dependsOn: [import_formSteps.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS]
  },
  [import_formSteps.default.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER]: {
    path: import_paths.default.HANDOVER_HOLIDAYS_ITEMS_FOR_CHANGEOVER,
    dependsOn: [import_formSteps.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS]
  },
  [import_formSteps.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN]: {
    path: import_paths.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN,
    dependsOn: [import_formSteps.default.TASK_LIST]
  },
  [import_formSteps.default.OTHER_THINGS_WHAT_OTHER_THINGS_MATTER]: {
    path: import_paths.default.OTHER_THINGS_WHAT_OTHER_THINGS_MATTER,
    dependsOn: [import_formSteps.default.TASK_LIST]
  },
  [import_formSteps.default.DECISION_MAKING_PLAN_LAST_MINUTE_CHANGES]: {
    path: import_paths.default.DECISION_MAKING_PLAN_LAST_MINUTE_CHANGES,
    dependsOn: [import_formSteps.default.TASK_LIST]
  },
  [import_formSteps.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE]: {
    path: import_paths.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE,
    dependsOn: [import_formSteps.default.DECISION_MAKING_PLAN_LAST_MINUTE_CHANGES]
  },
  [import_formSteps.default.DECISION_MAKING_PLAN_REVIEW]: {
    path: import_paths.default.DECISION_MAKING_PLAN_REVIEW,
    dependsOn: [import_formSteps.default.DECISION_MAKING_PLAN_LONG_TERM_NOTICE]
  },
  [import_formSteps.default.CHECK_YOUR_ANSWERS]: {
    path: import_paths.default.CHECK_YOUR_ANSWERS,
    dependsOn: [import_formSteps.default.TASK_LIST]
  },
  [import_formSteps.default.SHARE_PLAN]: {
    path: import_paths.default.SHARE_PLAN,
    dependsOn: [import_formSteps.default.CHECK_YOUR_ANSWERS]
  },
  [import_formSteps.default.CONFIRMATION]: {
    path: import_paths.default.CONFIRMATION,
    dependsOn: [import_formSteps.default.SHARE_PLAN]
  }
};
var flowConfig_default = TASK_FLOW_MAP;
//# sourceMappingURL=flowConfig.js.map
