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
var getBetweenHouseholds_exports = {};
__export(getBetweenHouseholds_exports, {
  default: () => getBetweenHouseholds_default
});
module.exports = __toCommonJS(getBetweenHouseholds_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const getFieldName = (childIndex) => `${import_formFields.default.GET_BETWEEN_HOUSEHOLDS}-${childIndex}`;
const getDescribeArrangementFieldName = (childIndex) => `${import_formFields.default.GET_BETWEEN_HOUSEHOLDS_DESCRIBE_ARRANGEMENT}-${childIndex}`;
const _getChildSelectorFieldName = (entryIndex) => `child-selector-${entryIndex}`;
const safeString = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
};
const getBetweenHouseholdsRoutes = (router) => {
  router.get(import_paths.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS), (request, response) => {
    const { numberOfChildren, namesOfChildren, handoverAndHolidays } = request.session;
    const isD2 = (0, import_perChildSession.isDesign2)(request.session);
    const activeChildIndex = isD2 ? request.session.currentChildIndex ?? 0 : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const sessionHandoverAndHolidays = isD2 ? (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays") : handoverAndHolidays;
    const existingAnswers = sessionHandoverAndHolidays?.getBetweenHouseholds;
    const formValues = {};
    const childrenWithAnswers = [];
    if (existingAnswers) {
      if (existingAnswers.default?.how) {
        formValues[getFieldName(0)] = existingAnswers.default.how;
      }
      if (existingAnswers.default?.describeArrangement) {
        formValues[getDescribeArrangementFieldName(0)] = existingAnswers.default.describeArrangement;
      }
      if (existingAnswers.byChild) {
        Object.entries(existingAnswers.byChild).forEach(([childIndex, answer]) => {
          const idx = parseInt(childIndex, 10);
          if (answer.how) {
            childrenWithAnswers.push(idx);
            formValues[getFieldName(idx)] = answer.how;
            if (answer.describeArrangement) {
              formValues[getDescribeArrangementFieldName(idx)] = answer.describeArrangement;
            }
          }
        });
      }
    }
    const childOptions = namesOfChildren.map((name, index) => ({
      value: index.toString(),
      text: name
    }));
    response.render("pages/handoverAndHolidays/getBetweenHouseholds", {
      errors: request.flash("errors"),
      formValues: { ...formValues, ...request.flash("formValues")?.[0] },
      title: isD2 ? `How will ${activeChildName} get between the two households?` : request.__("handoverAndHolidays.getBetweenHouseholds.title"),
      values: request.session,
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
    import_paths.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS,
    (request, response, next) => {
      const { numberOfChildren } = request.session;
      const validations = [];
      validations.push(
        (0, import_express_validator.body)(getFieldName(0)).exists().withMessage((_value, { req }) => req.__("handoverAndHolidays.getBetweenHouseholds.emptyError"))
      );
      validations.push(
        (0, import_express_validator.body)(getDescribeArrangementFieldName(0)).if((0, import_express_validator.body)(getFieldName(0)).equals("other")).trim().notEmpty().withMessage((_value, { req }) => req.__("handoverAndHolidays.getBetweenHouseholds.arrangementMissingError"))
      );
      for (let i = 1; i <= numberOfChildren; i++) {
        const fieldName = getFieldName(i);
        const describeFieldName = getDescribeArrangementFieldName(i);
        if (request.body[fieldName] !== void 0 && request.body[fieldName] !== "") {
          validations.push(
            (0, import_express_validator.body)(fieldName).exists().withMessage((_value, { req }) => req.__("handoverAndHolidays.getBetweenHouseholds.emptyError"))
          );
          validations.push(
            (0, import_express_validator.body)(describeFieldName).if((0, import_express_validator.body)(fieldName).equals("other")).trim().notEmpty().withMessage((_value, { req }) => req.__("handoverAndHolidays.getBetweenHouseholds.arrangementMissingError"))
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
        return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);
      }
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        request.flash("formValues", request.body);
        return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);
      }
      const defaultHow = safeString(request.body[getFieldName(0)]);
      const defaultDescribeArrangement = safeString(request.body[getDescribeArrangementFieldName(0)]);
      const byChild = {};
      let additionalEntries;
      if ((0, import_perChildSession.isDesign4)(request.session)) {
        additionalEntries = Object.keys(request.body).filter((key) => /^child-checkbox-\d+$/.test(key)).flatMap((key) => {
          const entryIndex = parseInt(key.replace("child-checkbox-", ""), 10);
          const rawValues = request.body[key];
          const childIndices = (Array.isArray(rawValues) ? rawValues : [rawValues]).map((v) => parseInt(v, 10)).filter((v) => !isNaN(v));
          const howFieldName = getFieldName(entryIndex);
          const describeFieldName = getDescribeArrangementFieldName(entryIndex);
          const how = safeString(request.body[howFieldName]);
          const describeArrangement = safeString(request.body[describeFieldName]);
          return childIndices.map((childIndex) => ({ childIndex, how, describeArrangement, entryIndex }));
        }).filter((entry) => entry.how);
      } else {
        additionalEntries = Object.keys(request.body).filter((key) => key.startsWith("child-selector-")).map((key) => {
          const entryIndex = parseInt(key.replace("child-selector-", ""), 10);
          const childIndex = parseInt(request.body[key], 10);
          const howFieldName = getFieldName(entryIndex);
          const describeFieldName = getDescribeArrangementFieldName(entryIndex);
          const how = safeString(request.body[howFieldName]);
          const describeArrangement = safeString(request.body[describeFieldName]);
          return { childIndex, how, describeArrangement, entryIndex };
        }).filter((entry) => !isNaN(entry.childIndex) && entry.how);
      }
      additionalEntries.forEach((entry) => {
        byChild[entry.childIndex] = {
          noDecisionRequired: false,
          how: entry.how,
          describeArrangement: entry.how === "other" ? entry.describeArrangement : void 0
        };
      });
      const { numberOfChildren } = request.session;
      const currentHandoverAndHolidays = (0, import_perChildSession.isDesign2)(request.session) ? (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays") || {} : request.session.handoverAndHolidays || {};
      const newHAH = {
        ...currentHandoverAndHolidays,
        getBetweenHouseholds: {
          default: {
            noDecisionRequired: false,
            how: defaultHow,
            describeArrangement: defaultHow === "other" ? defaultDescribeArrangement : void 0
          },
          ...Object.keys(byChild).length > 0 ? { byChild } : {}
        }
      };
      if ((0, import_perChildSession.isDesign2)(request.session)) {
        (0, import_perChildSession.setSessionSection)(request.session, "handoverAndHolidays", newHAH);
      } else {
        request.session.handoverAndHolidays = newHAH;
      }
      (0, import_addCompletedStep.default)(request, import_formSteps.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);
      if ((0, import_perChildSession.isDesign2)(request.session)) {
        if (request.body["apply-to-all"] === "yes") {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childHAH = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays") || {};
              (0, import_perChildSession.setSessionSection)(request.session, "handoverAndHolidays", { ...childHAH, getBetweenHouseholds: newHAH.getBetweenHouseholds });
            }
          }
          request.session.currentChildIndex = 0;
          return response.redirect(import_paths.default.TASK_LIST);
        }
        const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
        if (nextChildIndex < numberOfChildren) {
          request.session.currentChildIndex = nextChildIndex;
          return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);
        }
        request.session.currentChildIndex = 0;
        return response.redirect(import_paths.default.TASK_LIST);
      }
      return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER);
    }
  );
  router.post(import_paths.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS_NOT_REQUIRED, (request, response) => {
    request.session.handoverAndHolidays = {
      ...request.session.handoverAndHolidays,
      getBetweenHouseholds: {
        default: {
          noDecisionRequired: true
        }
      }
    };
    (0, import_addCompletedStep.default)(request, import_formSteps.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS);
    return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER);
  });
};
var getBetweenHouseholds_default = getBetweenHouseholdsRoutes;
//# sourceMappingURL=getBetweenHouseholds.js.map
