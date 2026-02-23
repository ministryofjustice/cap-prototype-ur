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
var mostlyLive_exports = {};
__export(mostlyLive_exports, {
  default: () => mostlyLive_default
});
module.exports = __toCommonJS(mostlyLive_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const getFieldName = (childIndex) => `${import_formFields.default.MOSTLY_LIVE_WHERE}-${childIndex}`;
const getDescribeFieldName = (childIndex) => `${import_formFields.default.MOSTLY_LIVE_DESCRIBE_ARRANGEMENT}-${childIndex}`;
const safeString = (value) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || void 0;
  }
  return void 0;
};
const mostlyLiveRoutes = (router) => {
  router.get(import_paths.default.LIVING_VISITING_MOSTLY_LIVE, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.LIVING_VISITING_MOSTLY_LIVE), (request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
    const existingAnswers = livingAndVisiting?.mostlyLive;
    const formValues = {};
    const childrenWithAnswers = [];
    if (existingAnswers) {
      if (existingAnswers.default?.where) {
        formValues[getFieldName(0)] = existingAnswers.default.where;
        if (existingAnswers.default.describeArrangement) {
          formValues[getDescribeFieldName(0)] = existingAnswers.default.describeArrangement;
        }
      } else if (existingAnswers.where) {
        formValues[getFieldName(0)] = existingAnswers.where;
        if (existingAnswers.describeArrangement) {
          formValues[getDescribeFieldName(0)] = existingAnswers.describeArrangement;
        }
      }
      if (existingAnswers.byChild) {
        Object.entries(existingAnswers.byChild).forEach(([childIndex, answer]) => {
          const idx = parseInt(childIndex, 10);
          if (answer.where) {
            childrenWithAnswers.push(idx);
            formValues[getFieldName(idx)] = answer.where;
            if (answer.describeArrangement) {
              formValues[getDescribeFieldName(idx)] = answer.describeArrangement;
            }
          }
        });
      }
    }
    const flashValues = request.flash("formValues")?.[0] || {};
    const childOptions = namesOfChildren.map((name, index) => ({
      value: index.toString(),
      text: name
    }));
    const isD2 = (0, import_perChildSession.isDesign2)(request.session);
    const activeChildIndex = isD2 ? request.session.currentChildIndex ?? 0 : 0;
    const activeChildName = isD2 ? namesOfChildren[activeChildIndex] : null;
    response.render("pages/livingAndVisiting/mostlyLive", {
      errors: request.flash("errors"),
      title: isD2 ? `Where will ${activeChildName} mostly live?` : request.__("livingAndVisiting.mostlyLive.title"),
      values: request.session,
      formValues: { ...formValues, ...flashValues },
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.TASK_LIST),
      numberOfChildren,
      namesOfChildren,
      childOptions,
      childrenWithAnswers,
      childProgressCaption: isD2 ? `Child ${activeChildIndex + 1} of ${numberOfChildren}` : null,
      showPerChildOption: numberOfChildren > 1 && !(0, import_perChildSession.isDesign2)(request.session) && !(0, import_perChildSession.isDesign3)(request.session) && (0, import_perChildSession.isPerChildPoCEnabled)(request.session),
      showDesign3Option: numberOfChildren > 1 && (0, import_perChildSession.isDesign3)(request.session) && (0, import_perChildSession.isPerChildPoCEnabled)(request.session),
      designMode: request.session.perChildDesignMode || "design1"
    });
  });
  router.post(
    import_paths.default.LIVING_VISITING_MOSTLY_LIVE,
    (request, response, next) => {
      const { numberOfChildren } = request.session;
      const validations = [];
      validations.push(
        (0, import_express_validator.body)(getFieldName(0)).exists().withMessage((_value, { req }) => req.__("livingAndVisiting.mostlyLive.emptyError"))
      );
      validations.push(
        (0, import_express_validator.body)(getDescribeFieldName(0)).if((0, import_express_validator.body)(getFieldName(0)).equals("other")).trim().notEmpty().withMessage((_value, { req }) => req.__("livingAndVisiting.mostlyLive.arrangementMissingError"))
      );
      for (let i = 1; i <= numberOfChildren; i++) {
        const fieldName = getFieldName(i);
        const describeFieldName = getDescribeFieldName(i);
        if (request.body[fieldName] !== void 0 && request.body[fieldName] !== "") {
          validations.push(
            (0, import_express_validator.body)(describeFieldName).if((0, import_express_validator.body)(fieldName).equals("other")).trim().notEmpty().withMessage((_value, { req }) => req.__("livingAndVisiting.mostlyLive.arrangementMissingError"))
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
        return response.redirect(import_paths.default.LIVING_VISITING_MOSTLY_LIVE);
      }
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        request.flash("formValues", request.body);
        return response.redirect(import_paths.default.LIVING_VISITING_MOSTLY_LIVE);
      }
      const defaultWhere = request.body[getFieldName(0)];
      const defaultDescribe = safeString(request.body[getDescribeFieldName(0)]);
      const byChild = {};
      let additionalEntries;
      if ((0, import_perChildSession.isDesign4)(request.session)) {
        additionalEntries = Object.keys(request.body).filter((key) => /^child-checkbox-\d+$/.test(key)).flatMap((key) => {
          const entryIndex = parseInt(key.replace("child-checkbox-", ""), 10);
          const rawValues = request.body[key];
          const childIndices = (Array.isArray(rawValues) ? rawValues : [rawValues]).map((v) => parseInt(v, 10)).filter((v) => !isNaN(v));
          const whereFieldName = getFieldName(entryIndex);
          const describeFieldName = getDescribeFieldName(entryIndex);
          const where = request.body[whereFieldName];
          const describeArrangement = safeString(request.body[describeFieldName]);
          return childIndices.map((childIndex) => ({ childIndex, where, describeArrangement, entryIndex }));
        }).filter((entry) => entry.where);
      } else {
        additionalEntries = Object.keys(request.body).filter((key) => key.startsWith("child-selector-")).map((key) => {
          const entryIndex = parseInt(key.replace("child-selector-", ""), 10);
          const childIndex = parseInt(request.body[key], 10);
          const whereFieldName = getFieldName(entryIndex);
          const describeFieldName = getDescribeFieldName(entryIndex);
          const where = request.body[whereFieldName];
          const describeArrangement = safeString(request.body[describeFieldName]);
          return { childIndex, where, describeArrangement, entryIndex };
        }).filter((entry) => !isNaN(entry.childIndex) && entry.where);
      }
      additionalEntries.forEach((entry) => {
        byChild[entry.childIndex] = {
          where: entry.where,
          describeArrangement: entry.where === "other" ? entry.describeArrangement : void 0
        };
      });
      const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting") || {};
      const currentMostlyLive = livingAndVisiting?.mostlyLive;
      const currentDefaultWhere = currentMostlyLive?.default?.where || currentMostlyLive?.where;
      const shouldClearDownstream = defaultWhere !== currentDefaultWhere;
      const newMostlyLive = {
        default: {
          where: defaultWhere,
          describeArrangement: defaultWhere === "other" ? defaultDescribe : void 0
        },
        ...Object.keys(byChild).length > 0 ? { byChild } : {}
      };
      (0, import_perChildSession.setSessionSection)(request.session, "livingAndVisiting", {
        mostlyLive: newMostlyLive,
        // Clear downstream if default answer changed
        ...shouldClearDownstream ? {} : {
          whichSchedule: livingAndVisiting?.whichSchedule,
          overnightVisits: livingAndVisiting?.overnightVisits,
          daytimeVisits: livingAndVisiting?.daytimeVisits
        }
      });
      (0, import_addCompletedStep.default)(request, import_formSteps.default.LIVING_VISITING_MOSTLY_LIVE);
      if ((0, import_perChildSession.isDesign2)(request.session)) {
        if (request.body["apply-to-all"] === "yes") {
          const savedIndex = request.session.currentChildIndex ?? 0;
          for (let i = 0; i < request.session.numberOfChildren; i++) {
            if (i !== savedIndex) {
              request.session.currentChildIndex = i;
              const childLAV = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting") || {};
              (0, import_perChildSession.setSessionSection)(request.session, "livingAndVisiting", { ...childLAV, mostlyLive: newMostlyLive });
            }
          }
          request.session.currentChildIndex = 0;
          return response.redirect(import_paths.default.TASK_LIST);
        }
        const nextChildIndex = (request.session.currentChildIndex ?? 0) + 1;
        if (nextChildIndex < request.session.numberOfChildren) {
          request.session.currentChildIndex = nextChildIndex;
          return response.redirect(import_paths.default.LIVING_VISITING_MOSTLY_LIVE);
        }
        request.session.currentChildIndex = 0;
        return response.redirect(import_paths.default.TASK_LIST);
      }
      switch (defaultWhere) {
        case "other":
          return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
        case "split":
          return response.redirect(import_paths.default.LIVING_VISITING_WHICH_SCHEDULE);
        default:
          return response.redirect(import_paths.default.LIVING_VISITING_WILL_OVERNIGHTS_HAPPEN);
      }
    }
  );
};
var mostlyLive_default = mostlyLiveRoutes;
//# sourceMappingURL=mostlyLive.js.map
