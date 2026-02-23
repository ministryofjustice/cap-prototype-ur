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
var aboutTheAdults_exports = {};
__export(aboutTheAdults_exports, {
  default: () => aboutTheAdults_default
});
module.exports = __toCommonJS(aboutTheAdults_exports);
var import_express_validator = require("express-validator");
var import_formFields = __toESM(require("../constants/formFields"));
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../utils/addCompletedStep"));
var import_sessionHelpers = require("../utils/sessionHelpers");
const aboutTheAdultsRoutes = (router) => {
  router.get(import_paths.default.ABOUT_THE_ADULTS, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.ABOUT_THE_ADULTS), (request, response) => {
    const formValues = {
      [import_formFields.default.INITIAL_ADULT_NAME]: request.session.initialAdultName,
      [import_formFields.default.SECONDARY_ADULT_NAME]: request.session.secondaryAdultName,
      ...request.flash("formValues")?.[0]
    };
    response.render("pages/aboutTheAdults", {
      errors: request.flash("errors"),
      formValues,
      title: request.__("aboutTheAdults.title"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.ABOUT_THE_CHILDREN)
    });
  });
  router.post(
    import_paths.default.ABOUT_THE_ADULTS,
    (0, import_express_validator.body)(import_formFields.default.INITIAL_ADULT_NAME).trim().notEmpty().withMessage((_value, { req }) => req.__("aboutTheAdults.initialError")),
    (0, import_express_validator.body)(import_formFields.default.SECONDARY_ADULT_NAME).trim().notEmpty().withMessage((_value, { req }) => req.__("aboutTheAdults.secondaryError")),
    (0, import_express_validator.body)(import_formFields.default.SECONDARY_ADULT_NAME).custom((value, { req }) => value !== req.body[import_formFields.default.INITIAL_ADULT_NAME]).withMessage((_value, { req }) => req.__("aboutTheAdults.sameNameError")),
    (request, response) => {
      const formData = (0, import_express_validator.matchedData)(request, { onlyValidData: false });
      const errors = (0, import_express_validator.validationResult)(request);
      if (!errors.isEmpty()) {
        request.flash("errors", errors.array());
        request.flash("formValues", formData);
        return response.redirect(import_paths.default.ABOUT_THE_ADULTS);
      }
      request.session.initialAdultName = formData[import_formFields.default.INITIAL_ADULT_NAME];
      request.session.secondaryAdultName = formData[import_formFields.default.SECONDARY_ADULT_NAME];
      (0, import_addCompletedStep.default)(request, import_formSteps.default.ABOUT_THE_ADULTS);
      return response.redirect((0, import_sessionHelpers.getRedirectUrlAfterFormSubmit)(request.session, import_paths.default.TASK_LIST));
    }
  );
};
var aboutTheAdults_default = aboutTheAdultsRoutes;
//# sourceMappingURL=aboutTheAdults.js.map
