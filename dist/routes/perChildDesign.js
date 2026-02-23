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
var perChildDesign_exports = {};
__export(perChildDesign_exports, {
  default: () => perChildDesign_default
});
module.exports = __toCommonJS(perChildDesign_exports);
var import_express_validator = require("express-validator");
var import_paths = __toESM(require("../constants/paths"));
const perChildDesignRoutes = (router) => {
  router.post(import_paths.default.TOGGLE_DESIGN_MODE, (request, response) => {
    const newMode = request.body.designMode;
    if (!["design1", "design2", "design3", "design4"].includes(newMode)) {
      return response.redirect(import_paths.default.TASK_LIST);
    }
    request.session.perChildDesignMode = newMode;
    if (newMode === "design2" && request.session.numberOfChildren > 0) {
      initializeChildPlans(request);
    }
    return response.redirect(import_paths.default.TASK_LIST);
  });
  router.post(
    import_paths.default.SELECT_CHILD,
    (0, import_express_validator.body)("childIndex").isInt({ min: 0 }).toInt(),
    (request, response) => {
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        return response.redirect(import_paths.default.TASK_LIST);
      }
      const childIndex = parseInt(request.body.childIndex, 10);
      if (childIndex >= request.session.numberOfChildren) {
        return response.redirect(import_paths.default.TASK_LIST);
      }
      request.session.currentChildIndex = childIndex;
      initializeChildPlans(request);
      return response.redirect(import_paths.default.TASK_LIST);
    }
  );
  router.post(
    import_paths.default.COPY_CHILD_PLAN,
    (0, import_express_validator.body)("sourceChildIndex").isInt({ min: 0 }).toInt(),
    (0, import_express_validator.body)("targetChildIndex").isInt({ min: 0 }).toInt(),
    (request, response) => {
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        return response.redirect(import_paths.default.TASK_LIST);
      }
      const sourceIndex = parseInt(request.body.sourceChildIndex, 10);
      const targetIndex = parseInt(request.body.targetChildIndex, 10);
      if (sourceIndex >= request.session.numberOfChildren || targetIndex >= request.session.numberOfChildren || sourceIndex === targetIndex) {
        return response.redirect(import_paths.default.TASK_LIST);
      }
      initializeChildPlans(request);
      const { childPlans, namesOfChildren } = request.session;
      const sourcePlan = childPlans?.find((p) => p.childIndex === sourceIndex);
      if (sourcePlan && childPlans) {
        let targetPlan = childPlans.find((p) => p.childIndex === targetIndex);
        if (!targetPlan) {
          targetPlan = {
            childIndex: targetIndex,
            childName: namesOfChildren[targetIndex],
            isComplete: false
          };
          childPlans.push(targetPlan);
        }
        targetPlan.livingAndVisiting = JSON.parse(JSON.stringify(sourcePlan.livingAndVisiting || {}));
        targetPlan.handoverAndHolidays = JSON.parse(JSON.stringify(sourcePlan.handoverAndHolidays || {}));
        targetPlan.specialDays = JSON.parse(JSON.stringify(sourcePlan.specialDays || {}));
        targetPlan.otherThings = JSON.parse(JSON.stringify(sourcePlan.otherThings || {}));
        targetPlan.decisionMaking = JSON.parse(JSON.stringify(sourcePlan.decisionMaking || {}));
        targetPlan.copiedFromChildIndex = sourceIndex;
        targetPlan.isComplete = sourcePlan.isComplete;
        request.session.childPlans = childPlans;
      }
      request.session.currentChildIndex = targetIndex;
      return response.redirect(import_paths.default.TASK_LIST);
    }
  );
};
function initializeChildPlans(request) {
  const { numberOfChildren, namesOfChildren, childPlans } = request.session;
  if (!childPlans || childPlans.length === 0) {
    request.session.childPlans = [];
    for (let i = 0; i < numberOfChildren; i++) {
      request.session.childPlans.push({
        childIndex: i,
        childName: namesOfChildren[i],
        isComplete: false
      });
    }
  }
  if (request.session.currentChildIndex === void 0) {
    request.session.currentChildIndex = 0;
  }
}
var perChildDesign_default = perChildDesignRoutes;
//# sourceMappingURL=perChildDesign.js.map
