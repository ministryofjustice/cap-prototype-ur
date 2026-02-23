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
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");
var import_config = __toESM(require("../config"));
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
var import_addCompletedStep = __toESM(require("../utils/addCompletedStep"));
var import_aboutTheAdults = __toESM(require("./aboutTheAdults"));
var import_aboutTheChildren = __toESM(require("./aboutTheChildren"));
var import_accessibilityStatement = __toESM(require("./accessibilityStatement"));
var import_analytics = __toESM(require("./analytics"));
var import_checkYourAnswers = __toESM(require("./checkYourAnswers"));
var import_childrenSafetyCheck = __toESM(require("./childrenSafetyCheck"));
var import_confirmation = __toESM(require("./confirmation"));
var import_courtOrderCheck = __toESM(require("./courtOrderCheck"));
var import_decisionMaking = __toESM(require("./decisionMaking"));
var import_doWhatsBest = __toESM(require("./doWhatsBest"));
var import_downloads = __toESM(require("./downloads"));
var import_existingCourtOrder = __toESM(require("./existingCourtOrder"));
var import_handoverAndHolidays = __toESM(require("./handoverAndHolidays"));
var import_livingAndVisiting = __toESM(require("./livingAndVisiting"));
var import_numberOfChildren = __toESM(require("./numberOfChildren"));
var import_otherThings = __toESM(require("./otherThings"));
var import_perChildDesign = __toESM(require("./perChildDesign"));
var import_safetyCheck = __toESM(require("./safetyCheck"));
var import_sharePlan = __toESM(require("./sharePlan"));
var import_specialDays = __toESM(require("./specialDays"));
var import_taskList = __toESM(require("./taskList"));
const routes = () => {
  const router = (0, import_express.Router)();
  router.get(import_paths.default.START, (request, response) => {
    if (import_config.default.isLiveService) {
      return response.redirect(import_paths.default.SAFETY_CHECK);
    }
    (0, import_addCompletedStep.default)(request, import_formSteps.default.START);
    const { usePerChildPoC, perChildDesignMode } = request.session;
    let currentDesignMode = "current";
    if (usePerChildPoC) {
      currentDesignMode = perChildDesignMode || "design1";
    }
    response.render("pages/index", {
      showUrToggle: true,
      usePerChildPoC: usePerChildPoC || false,
      currentDesignMode
    });
  });
  router.post(import_paths.default.START, (request, response) => {
    const { serviceVersion } = request.body;
    const validDesigns = ["current", "design1", "design2", "design3", "design4", "poc"];
    const design = validDesigns.includes(serviceVersion) ? serviceVersion : "current";
    const newUsePerChildPoC = design !== "current";
    const newDesignMode = design !== "current" && design !== "poc" ? design : design === "poc" ? "design1" : void 0;
    delete request.session.numberOfChildren;
    delete request.session.namesOfChildren;
    delete request.session.initialAdultName;
    delete request.session.secondaryAdultName;
    delete request.session.perChildDesignMode;
    delete request.session.currentChildIndex;
    delete request.session.childPlans;
    delete request.session.livingAndVisiting;
    delete request.session.handoverAndHolidays;
    delete request.session.specialDays;
    delete request.session.otherThings;
    delete request.session.decisionMaking;
    request.session.usePerChildPoC = newUsePerChildPoC;
    if (newDesignMode) {
      request.session.perChildDesignMode = newDesignMode;
    }
    request.session.completedSteps = [import_formSteps.default.START];
    request.session.planStartTime = Date.now();
    response.redirect(import_paths.default.SAFETY_CHECK);
  });
  (0, import_analytics.default)(router);
  (0, import_safetyCheck.default)(router);
  (0, import_childrenSafetyCheck.default)(router);
  (0, import_doWhatsBest.default)(router);
  (0, import_courtOrderCheck.default)(router);
  (0, import_existingCourtOrder.default)(router);
  (0, import_numberOfChildren.default)(router);
  (0, import_aboutTheChildren.default)(router);
  (0, import_aboutTheAdults.default)(router);
  (0, import_taskList.default)(router);
  (0, import_checkYourAnswers.default)(router);
  (0, import_sharePlan.default)(router);
  (0, import_confirmation.default)(router);
  (0, import_livingAndVisiting.default)(router);
  (0, import_handoverAndHolidays.default)(router);
  (0, import_specialDays.default)(router);
  (0, import_otherThings.default)(router);
  (0, import_decisionMaking.default)(router);
  (0, import_downloads.default)(router);
  (0, import_accessibilityStatement.default)(router);
  (0, import_perChildDesign.default)(router);
  return router;
};
var routes_default = routes;
//# sourceMappingURL=index.js.map
