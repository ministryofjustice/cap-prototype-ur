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
var whereHandover_exports = {};
__export(whereHandover_exports, {
  default: () => whereHandover_default
});
module.exports = __toCommonJS(whereHandover_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const getFieldName = (childIndex) => `${import_formFields.default.WHERE_HANDOVER}-${childIndex}`;
const getSomeoneElseFieldName = (childIndex) => `${import_formFields.default.WHERE_HANDOVER_SOMEONE_ELSE}-${childIndex}`;
const _getChildSelectorFieldName = (entryIndex) => `child-selector-${entryIndex}`;
const safeString = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
};
const safeArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string");
  }
  if (typeof value === "string") {
    return [value];
  }
  return [];
};
const whereHandoverRoutes = (router) => {
  router.get(import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER), (request, response) => {
    const { numberOfChildren, namesOfChildren, handoverAndHolidays } = request.session;
    const isD2 = (0, import_perChildSession.isDesign2)(request.session);
    const activeChildIndex = isD2 ? request.session.currentChildIndex ?? 0 : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    const sessionHandoverAndHolidays = isD2 ? (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays") : handoverAndHolidays;
    const existingAnswers = sessionHandoverAndHolidays?.whereHandover;
    const formValues = {};
    const childrenWithAnswers = [];
    if (existingAnswers) {
      if (existingAnswers.default?.where) {
        formValues[getFieldName(0)] = existingAnswers.default.where;
      }
      if (existingAnswers.default?.someoneElse) {
        formValues[getSomeoneElseFieldName(0)] = existingAnswers.default.someoneElse;
      }
      if (existingAnswers.byChild) {
        Object.entries(existingAnswers.byChild).forEach(([childIndex, answer]) => {
          const idx = parseInt(childIndex, 10);
          if (answer.where) {
            childrenWithAnswers.push(idx);
            formValues[getFieldName(idx)] = answer.where;
            if (answer.someoneElse) {
              formValues[getSomeoneElseFieldName(idx)] = answer.someoneElse;
            }
          }
        });
      }
    }
    const childOptions = namesOfChildren.map((name, index) => ({
      value: index.toString(),
      text: name
    }));
    response.render("pages/handoverAndHolidays/whereHandover", {
      errors: request.flash("errors"),
      formValues: { ...formValues, ...request.flash("formValues")?.[0] },
      values: request.session,
      title: isD2 ? `Where will ${activeChildName}'s handover take place?` : request.__("handoverAndHolidays.whereHandover.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.HANDOVER_HOLIDAYS_GET_BETWEEN_HOUSEHOLDS),
      numberOfChildren,
      namesOfChildren,
      childOptions,
      childrenWithAnswers,
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      showPerChildOption: numberOfChildren > 1 && (0, import_perChildSession.isAnswerPerChild)(request.session) && !(0, import_perChildSession.isDesign3)(request.session) && (0, import_perChildSession.isPerChildPoCEnabled)(request.session),
      showDesign3Option: numberOfChildren > 1 && (0, import_perChildSession.isDesign3)(request.session) && (0, import_perChildSession.isPerChildPoCEnabled)(request.session),
      designMode: request.session.perChildDesignMode || "design1"
    });
  });
  router.post(
    import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER,
    (request, response, next) => {
      const { numberOfChildren } = request.session;
      const validations = [];
      validations.push(
        (0, import_express_validator.body)(getFieldName(0)).exists().toArray().withMessage((_value, { req }) => req.__("handoverAndHolidays.whereHandover.emptyError"))
      );
      validations.push(
        (0, import_express_validator.body)(getFieldName(0)).toArray().custom(
          (whereHandover) => !(whereHandover.length > 1 && whereHandover.includes("someoneElse"))
        ).withMessage((_value, { req }) => req.__("handoverAndHolidays.whereHandover.multiSelectedError"))
      );
      validations.push(
        (0, import_express_validator.body)(getSomeoneElseFieldName(0)).if((0, import_express_validator.body)(getFieldName(0)).toArray().custom((value) => value && value.includes("someoneElse"))).trim().notEmpty().withMessage((_value, { req }) => req.__("handoverAndHolidays.whereHandover.arrangementMissingError"))
      );
      for (let i = 1; i <= numberOfChildren; i++) {
        const fieldName = getFieldName(i);
        const someoneElseFieldName = getSomeoneElseFieldName(i);
        if (request.body[fieldName] !== void 0 && request.body[fieldName] !== "") {
          validations.push(
            (0, import_express_validator.body)(fieldName).exists().toArray().withMessage((_value, { req }) => req.__("handoverAndHolidays.whereHandover.emptyError"))
          );
          validations.push(
            (0, import_express_validator.body)(fieldName).toArray().custom(
              (whereHandover) => !(whereHandover.length > 1 && whereHandover.includes("someoneElse"))
            ).withMessage((_value, { req }) => req.__("handoverAndHolidays.whereHandover.multiSelectedError"))
          );
          validations.push(
            (0, import_express_validator.body)(someoneElseFieldName).if((0, import_express_validator.body)(fieldName).toArray().custom((value) => value && value.includes("someoneElse"))).trim().notEmpty().withMessage((_value, { req }) => req.__("handoverAndHolidays.whereHandover.arrangementMissingError"))
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
        return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER);
      }
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        request.flash("formValues", request.body);
        return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER);
      }
      const defaultWhere = safeArray(request.body[getFieldName(0)]);
      const defaultSomeoneElse = safeString(request.body[getSomeoneElseFieldName(0)]);
      const byChild = {};
      let additionalEntries;
      if ((0, import_perChildSession.isDesign4)(request.session)) {
        additionalEntries = Object.keys(request.body).filter((key) => /^child-checkbox-\d+$/.test(key)).flatMap((key) => {
          const entryIndex = parseInt(key.replace("child-checkbox-", ""), 10);
          const rawValues = request.body[key];
          const childIndices = (Array.isArray(rawValues) ? rawValues : [rawValues]).map((v) => parseInt(v, 10)).filter((v) => !isNaN(v));
          const whereFieldName = getFieldName(entryIndex);
          const someoneElseFieldName = getSomeoneElseFieldName(entryIndex);
          const where = safeArray(request.body[whereFieldName]);
          const someoneElse = safeString(request.body[someoneElseFieldName]);
          return childIndices.map((childIndex) => ({ childIndex, where, someoneElse, entryIndex }));
        }).filter((entry) => entry.where.length > 0);
      } else {
        additionalEntries = Object.keys(request.body).filter((key) => key.startsWith("child-selector-")).map((key) => {
          const entryIndex = parseInt(key.replace("child-selector-", ""), 10);
          const childIndex = parseInt(request.body[key], 10);
          const whereFieldName = getFieldName(entryIndex);
          const someoneElseFieldName = getSomeoneElseFieldName(entryIndex);
          const where = safeArray(request.body[whereFieldName]);
          const someoneElse = safeString(request.body[someoneElseFieldName]);
          return { childIndex, where, someoneElse, entryIndex };
        }).filter((entry) => !isNaN(entry.childIndex) && entry.where.length > 0);
      }
      additionalEntries.forEach((entry) => {
        byChild[entry.childIndex] = {
          noDecisionRequired: false,
          where: entry.where,
          someoneElse: entry.where.includes("someoneElse") ? entry.someoneElse : void 0
        };
      });
      const { numberOfChildren } = request.session;
      const newWhereHandover = {
        default: {
          noDecisionRequired: false,
          where: defaultWhere,
          someoneElse: defaultWhere.includes("someoneElse") ? defaultSomeoneElse : void 0
        },
        ...Object.keys(byChild).length > 0 ? { byChild } : {}
      };
      if ((0, import_perChildSession.isDesign2)(request.session)) {
        const currentHAH = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays") || {};
        (0, import_perChildSession.setSessionSection)(request.session, "handoverAndHolidays", { ...currentHAH, whereHandover: newWhereHandover });
      } else {
        request.session.handoverAndHolidays = {
          ...request.session.handoverAndHolidays,
          whereHandover: newWhereHandover
        };
      }
      (0, import_addCompletedStep.default)(request, import_formSteps.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER);
      if ((0, import_perChildSession.isDesign2)(request.session)) {
        if (request.body["apply-to-all"] === "yes") {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childHAH = (0, import_perChildSession.getSessionValue)(request.session, "handoverAndHolidays") || {};
              (0, import_perChildSession.setSessionSection)(request.session, "handoverAndHolidays", { ...childHAH, whereHandover: newWhereHandover });
            }
          }
          request.session.currentChildIndex = 0;
          return response.redirect(import_paths.default.TASK_LIST);
        }
        const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
        if (nextChildIndex < numberOfChildren) {
          request.session.currentChildIndex = nextChildIndex;
          return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER);
        }
        request.session.currentChildIndex = 0;
        return response.redirect(import_paths.default.TASK_LIST);
      }
      return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);
    }
  );
  router.post(import_paths.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER_NOT_REQUIRED, (request, response) => {
    request.session.handoverAndHolidays = {
      ...request.session.handoverAndHolidays,
      whereHandover: {
        default: {
          noDecisionRequired: true
        }
      }
    };
    (0, import_addCompletedStep.default)(request, import_formSteps.default.HANDOVER_HOLIDAYS_WHERE_HANDOVER);
    return response.redirect(import_paths.default.HANDOVER_HOLIDAYS_WILL_CHANGE_DURING_SCHOOL_HOLIDAYS);
  });
};
var whereHandover_default = whereHandoverRoutes;
//# sourceMappingURL=whereHandover.js.map
