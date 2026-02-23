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
var perChildSession_exports = {};
__export(perChildSession_exports, {
  createPerChildAnswer: () => createPerChildAnswer,
  getCurrentChildIndex: () => getCurrentChildIndex,
  getCurrentChildPlan: () => getCurrentChildPlan,
  getDefaultValue: () => getDefaultValue,
  getSessionValue: () => getSessionValue,
  isAnswerPerChild: () => isAnswerPerChild,
  isDesign2: () => isDesign2,
  isDesign3: () => isDesign3,
  isDesign4: () => isDesign4,
  isPerChildAnswer: () => isPerChildAnswer,
  isPerChildPoCEnabled: () => isPerChildPoCEnabled,
  setSessionSection: () => setSessionSection,
  setSessionValue: () => setSessionValue
});
module.exports = __toCommonJS(perChildSession_exports);
function isPerChildPoCEnabled(session) {
  return session.usePerChildPoC === true;
}
function isDesign2(session) {
  return session.perChildDesignMode === "design2";
}
function isDesign3(session) {
  return session.perChildDesignMode === "design3";
}
function isDesign4(session) {
  return session.perChildDesignMode === "design4";
}
function isAnswerPerChild(session) {
  return !isDesign2(session);
}
function getCurrentChildIndex(session) {
  return session.currentChildIndex ?? 0;
}
function getCurrentChildPlan(session) {
  if (!isDesign2(session)) {
    return void 0;
  }
  const currentIndex = getCurrentChildIndex(session);
  return session.childPlans?.find((p) => p.childIndex === currentIndex);
}
function getSessionValue(session, section, field) {
  if (isDesign2(session)) {
    const childPlan = getCurrentChildPlan(session);
    if (!childPlan) return void 0;
    const sectionData2 = childPlan[section];
    if (!sectionData2) return void 0;
    if (field) {
      return sectionData2[field];
    }
    return sectionData2;
  }
  const sectionData = session[section];
  if (!sectionData) return void 0;
  if (field) {
    return sectionData[field];
  }
  return sectionData;
}
function setSessionValue(session, section, field, value) {
  if (isDesign2(session)) {
    const currentIndex = getCurrentChildIndex(session);
    if (!session.childPlans) {
      session.childPlans = [];
    }
    let childPlan = session.childPlans.find((p) => p.childIndex === currentIndex);
    if (!childPlan) {
      childPlan = {
        childIndex: currentIndex,
        childName: session.namesOfChildren?.[currentIndex] ?? "",
        isComplete: false
      };
      session.childPlans.push(childPlan);
    }
    if (!childPlan[section]) {
      childPlan[section] = {};
    }
    childPlan[section][field] = value;
  } else {
    if (!session[section]) {
      session[section] = {};
    }
    session[section][field] = value;
  }
}
function setSessionSection(session, section, value) {
  if (isDesign2(session)) {
    const currentIndex = getCurrentChildIndex(session);
    if (!session.childPlans) {
      session.childPlans = [];
    }
    let childPlan = session.childPlans.find((p) => p.childIndex === currentIndex);
    if (!childPlan) {
      childPlan = {
        childIndex: currentIndex,
        childName: session.namesOfChildren?.[currentIndex] ?? "",
        isComplete: false
      };
      session.childPlans.push(childPlan);
    }
    childPlan[section] = value;
  } else {
    session[section] = value;
  }
}
function createPerChildAnswer(defaultValue) {
  return {
    default: defaultValue
  };
}
function getDefaultValue(value) {
  if (!value) return void 0;
  if (typeof value === "object" && value !== null && "default" in value) {
    return value.default;
  }
  return value;
}
function isPerChildAnswer(value) {
  return typeof value === "object" && value !== null && "default" in value && (value.byChild === void 0 || typeof value.byChild === "object");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPerChildAnswer,
  getCurrentChildIndex,
  getCurrentChildPlan,
  getDefaultValue,
  getSessionValue,
  isAnswerPerChild,
  isDesign2,
  isDesign3,
  isDesign4,
  isPerChildAnswer,
  isPerChildPoCEnabled,
  setSessionSection,
  setSessionValue
});
//# sourceMappingURL=perChildSession.js.map
