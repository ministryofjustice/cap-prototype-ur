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
var whichDaysOvernight_exports = {};
__export(whichDaysOvernight_exports, {
  default: () => whichDaysOvernight_default
});
module.exports = __toCommonJS(whichDaysOvernight_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../../constants/formFields"));
var import_formSteps = __toESM(require("../../constants/formSteps"));
var import_paths = __toESM(require("../../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../../utils/addCompletedStep"));
var import_formValueUtils = require("../../utils/formValueUtils");
var import_perChildSession = require("../../utils/perChildSession");
var import_sessionHelpers = require("../../utils/sessionHelpers");
const whichDaysOvernightRoutes = (router) => {
  router.get(import_paths.default.LIVING_VISITING_WHICH_DAYS_OVERNIGHT, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.LIVING_VISITING_WHICH_DAYS_OVERNIGHT), (request, response) => {
    const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting");
    const overnightVisits = livingAndVisiting?.overnightVisits;
    const [previousDaysOvernight, previousDescribeArrangement] = (0, import_formValueUtils.convertWhichDaysSessionValueToField)(
      overnightVisits?.whichDays
    );
    const formValues = {
      [import_formFields.default.WHICH_DAYS_OVERNIGHT]: previousDaysOvernight,
      [import_formFields.default.WHICH_DAYS_OVERNIGHT_DESCRIBE_ARRANGEMENT]: previousDescribeArrangement,
      ...request.flash("formValues")?.[0]
    };
    response.render("pages/livingAndVisiting/whichDaysOvernight", {
      errors: request.flash("errors"),
      formValues,
      title: request.__("livingAndVisiting.whichDaysOvernight.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.LIVING_VISITING_MOSTLY_LIVE)
    });
  });
  router.post(
    import_paths.default.LIVING_VISITING_WHICH_DAYS_OVERNIGHT,
    (0, import_express_validator.body)(import_formFields.default.WHICH_DAYS_OVERNIGHT_DESCRIBE_ARRANGEMENT).if((0, import_express_validator.body)(import_formFields.default.WHICH_DAYS_OVERNIGHT).equals("other")).trim().notEmpty().withMessage((_value, { req }) => req.__("livingAndVisiting.whichDaysOvernight.arrangementMissingError")),
    (0, import_express_validator.body)(import_formFields.default.WHICH_DAYS_OVERNIGHT).exists().toArray().withMessage((_value, { req }) => req.__("livingAndVisiting.whichDaysOvernight.emptyError")),
    (0, import_express_validator.body)(import_formFields.default.WHICH_DAYS_OVERNIGHT).custom(
      // This is prevented by JS in the page, but possible for people with JS disabled to submit
      (whichDaysOvernight) => !(whichDaysOvernight.length > 1 && whichDaysOvernight.includes("other"))
    ).withMessage((_value, { req }) => req.__("livingAndVisiting.whichDaysOvernight.multiSelectedError")),
    (request, response) => {
      const formData = (0, import_express_validator.matchedData)(request, { onlyValidData: false });
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        request.flash("formValues", formData);
        return response.redirect(import_paths.default.LIVING_VISITING_WHICH_DAYS_OVERNIGHT);
      }
      const {
        [import_formFields.default.WHICH_DAYS_OVERNIGHT]: whichDaysOvernight,
        [import_formFields.default.WHICH_DAYS_OVERNIGHT_DESCRIBE_ARRANGEMENT]: describeArrangement
      } = formData;
      const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting") || {};
      (0, import_perChildSession.setSessionSection)(request.session, "livingAndVisiting", {
        ...livingAndVisiting,
        overnightVisits: {
          ...livingAndVisiting.overnightVisits,
          whichDays: (0, import_formValueUtils.convertWhichDaysFieldToSessionValue)(whichDaysOvernight, describeArrangement)
        }
      });
      (0, import_addCompletedStep.default)(request, import_formSteps.default.LIVING_VISITING_WHICH_DAYS_OVERNIGHT);
      return response.redirect(import_paths.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
    }
  );
  router.post(import_paths.default.LIVING_VISITING_WHICH_DAYS_OVERNIGHT_NOT_REQUIRED, (request, response) => {
    const livingAndVisiting = (0, import_perChildSession.getSessionValue)(request.session, "livingAndVisiting") || {};
    (0, import_perChildSession.setSessionSection)(request.session, "livingAndVisiting", {
      ...livingAndVisiting,
      overnightVisits: {
        willHappen: true,
        whichDays: {
          noDecisionRequired: true
        }
      }
    });
    (0, import_addCompletedStep.default)(request, import_formSteps.default.LIVING_VISITING_WHICH_DAYS_OVERNIGHT);
    return response.redirect(import_paths.default.LIVING_VISITING_WILL_DAYTIME_VISITS_HAPPEN);
  });
};
var whichDaysOvernight_default = whichDaysOvernightRoutes;
//# sourceMappingURL=whichDaysOvernight.js.map
