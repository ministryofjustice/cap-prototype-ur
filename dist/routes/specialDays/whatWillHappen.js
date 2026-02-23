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
var whatWillHappen_exports = {};
__export(whatWillHappen_exports, {
  default: () => whatWillHappen_default
});
module.exports = __toCommonJS(whatWillHappen_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const getFieldName = (childIndex) => `${import_formFields.default.SPECIAL_DAYS}-${childIndex}`;
const _getChildSelectorFieldName = (entryIndex) => `child-selector-${entryIndex}`;
const safeString = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
};
const whatWillHappenRoutes = (router) => {
  router.get(import_paths.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN), (request, response) => {
    const { numberOfChildren, namesOfChildren, specialDays } = request.session;
    const isD2 = (0, import_perChildSession.isDesign2)(request.session);
    const activeChildIndex = isD2 ? request.session.currentChildIndex ?? 0 : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const sessionSpecialDays = isD2 ? (0, import_perChildSession.getSessionValue)(request.session, "specialDays") : specialDays;
    const existingAnswers = sessionSpecialDays?.whatWillHappen;
    const formValues = {};
    const childrenWithAnswers = [];
    if (existingAnswers) {
      if (existingAnswers.default?.answer) {
        formValues[getFieldName(0)] = existingAnswers.default.answer;
      }
      if (existingAnswers.byChild) {
        Object.entries(existingAnswers.byChild).forEach(([childIndex, answer]) => {
          const idx = parseInt(childIndex, 10);
          if (answer.answer) {
            childrenWithAnswers.push(idx);
            formValues[getFieldName(idx)] = answer.answer;
          }
        });
      }
    }
    const childOptions = namesOfChildren.map((name, index) => ({
      value: index.toString(),
      text: name
    }));
    response.render("pages/specialDays/whatWillHappen", {
      errors: request.flash("errors"),
      formValues: { ...formValues, ...request.flash("formValues")?.[0] },
      title: isD2 ? `What will happen for ${activeChildName} on special days?` : request.__("specialDays.whatWillHappen.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.TASK_LIST),
      numberOfChildren,
      namesOfChildren,
      childOptions,
      childrenWithAnswers,
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      showPerChildOption: numberOfChildren > 1 && !(0, import_perChildSession.isDesign3)(request.session) && (0, import_perChildSession.isPerChildPoCEnabled)(request.session),
      showDesign3Option: numberOfChildren > 1 && (0, import_perChildSession.isDesign3)(request.session) && (0, import_perChildSession.isPerChildPoCEnabled)(request.session),
      designMode: request.session.perChildDesignMode || "design1"
    });
  });
  router.post(
    import_paths.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN,
    (request, response, next) => {
      const { numberOfChildren } = request.session;
      const validations = [];
      validations.push(
        (0, import_express_validator.body)(getFieldName(0)).trim().notEmpty().withMessage((_value, { req }) => req.__("specialDays.whatWillHappen.error"))
      );
      for (let i = 1; i <= numberOfChildren; i++) {
        const fieldName = getFieldName(i);
        if (request.body[fieldName] !== void 0 && request.body[fieldName] !== "") {
          validations.push(
            (0, import_express_validator.body)(fieldName).trim().notEmpty().withMessage((_value, { req }) => req.__("specialDays.whatWillHappen.error"))
          );
        }
      }
      Promise.all(validations.map((validation) => validation.run(request))).then(() => next()).catch(next);
    },
    (request, response) => {
      if ((0, import_perChildSession.isDesign3)(request.session) && request.body["specify-per-child"] === "yes") {
        request.session.perChildDesignMode = "design2";
        request.session.currentChildIndex = 0;
        if (!request.session.childPlans || request.session.childPlans.length === 0) {
          request.session.childPlans = (request.session.namesOfChildren || []).map((name, index) => ({
            childIndex: index,
            childName: name,
            isComplete: false
          }));
        }
        return response.redirect(import_paths.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN);
      }
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        request.flash("formValues", request.body);
        return response.redirect(import_paths.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN);
      }
      const defaultAnswer = safeString(request.body[getFieldName(0)]);
      const byChild = {};
      let additionalEntries;
      if ((0, import_perChildSession.isDesign4)(request.session)) {
        additionalEntries = Object.keys(request.body).filter((key) => /^child-checkbox-\d+$/.test(key)).flatMap((key) => {
          const entryIndex = parseInt(key.replace("child-checkbox-", ""), 10);
          const rawValues = request.body[key];
          const childIndices = (Array.isArray(rawValues) ? rawValues : [rawValues]).map((v) => parseInt(v, 10)).filter((v) => !isNaN(v));
          const answerFieldName = getFieldName(entryIndex);
          const answer = safeString(request.body[answerFieldName]);
          return childIndices.map((childIndex) => ({ childIndex, answer, entryIndex }));
        }).filter((entry) => entry.answer);
      } else {
        additionalEntries = Object.keys(request.body).filter((key) => key.startsWith("child-selector-")).map((key) => {
          const entryIndex = parseInt(key.replace("child-selector-", ""), 10);
          const childIndex = parseInt(request.body[key], 10);
          const answerFieldName = getFieldName(entryIndex);
          const answer = safeString(request.body[answerFieldName]);
          return { childIndex, answer, entryIndex };
        }).filter((entry) => !isNaN(entry.childIndex) && entry.answer);
      }
      additionalEntries.forEach((entry) => {
        byChild[entry.childIndex] = {
          noDecisionRequired: false,
          answer: entry.answer
        };
      });
      const { numberOfChildren } = request.session;
      const newWhatWillHappen = {
        default: {
          noDecisionRequired: false,
          answer: defaultAnswer
        },
        ...Object.keys(byChild).length > 0 ? { byChild } : {}
      };
      if ((0, import_perChildSession.isDesign2)(request.session)) {
        const currentSpecialDays = (0, import_perChildSession.getSessionValue)(request.session, "specialDays") || {};
        (0, import_perChildSession.setSessionSection)(request.session, "specialDays", { ...currentSpecialDays, whatWillHappen: newWhatWillHappen });
      } else {
        request.session.specialDays = {
          ...request.session.specialDays,
          whatWillHappen: newWhatWillHappen
        };
      }
      (0, import_addCompletedStep.default)(request, import_formSteps.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN);
      if ((0, import_perChildSession.isDesign2)(request.session)) {
        if (request.body["apply-to-all"] === "yes") {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childSpecialDays = (0, import_perChildSession.getSessionValue)(request.session, "specialDays") || {};
              (0, import_perChildSession.setSessionSection)(request.session, "specialDays", { ...childSpecialDays, whatWillHappen: newWhatWillHappen });
            }
          }
          request.session.currentChildIndex = 0;
          return response.redirect(import_paths.default.TASK_LIST);
        }
        const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
        if (nextChildIndex < numberOfChildren) {
          request.session.currentChildIndex = nextChildIndex;
          return response.redirect(import_paths.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN);
        }
        request.session.currentChildIndex = 0;
        return response.redirect(import_paths.default.TASK_LIST);
      }
      return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
    }
  );
  router.post(import_paths.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN_NOT_REQUIRED, (request, response) => {
    request.session.specialDays = {
      ...request.session.specialDays,
      whatWillHappen: {
        default: {
          noDecisionRequired: true
        }
      }
    };
    (0, import_addCompletedStep.default)(request, import_formSteps.default.SPECIAL_DAYS_WHAT_WILL_HAPPEN);
    return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
  });
};
var whatWillHappen_default = whatWillHappenRoutes;
//# sourceMappingURL=whatWillHappen.js.map
