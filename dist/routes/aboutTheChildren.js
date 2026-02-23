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
var aboutTheChildren_exports = {};
__export(aboutTheChildren_exports, {
  default: () => aboutTheChildren_default
});
module.exports = __toCommonJS(aboutTheChildren_exports);
var import_formFields = __toESM(require("../constants/formFields"));
var import_formSteps = __toESM(require("../constants/formSteps"));
var import_paths = __toESM(require("../constants/paths"));
var import_checkFormProgressFromConfig = __toESM(require("../middleware/checkFormProgressFromConfig"));
var import_addCompletedStep = __toESM(require("../utils/addCompletedStep"));
var import_sessionHelpers = require("../utils/sessionHelpers");
const aboutTheChildrenRoutes = (router) => {
  router.get(import_paths.default.ABOUT_THE_CHILDREN, (0, import_checkFormProgressFromConfig.default)(import_formSteps.default.ABOUT_THE_CHILDREN), (request, response) => {
    const { numberOfChildren, namesOfChildren } = request.session;
    if (numberOfChildren == null) {
      return response.redirect(import_paths.default.NUMBER_OF_CHILDREN);
    }
    const formValues = {
      ...Object.fromEntries(
        Array.from({ length: numberOfChildren }, (_, i) => [import_formFields.default.CHILD_NAME + i, namesOfChildren?.[i]])
      ),
      ...request.flash("formValues")?.[0]
    };
    return response.render("pages/aboutTheChildren", {
      errors: request.flash("errors"),
      formValues,
      title: numberOfChildren === 1 ? request.__("aboutTheChildren.singleTitle") : request.__("aboutTheChildren.multipleTitle"),
      backLinkHref: (0, import_sessionHelpers.getBackUrl)(request.session, import_paths.default.NUMBER_OF_CHILDREN),
      numberOfChildren
    });
  });
  router.post(import_paths.default.ABOUT_THE_CHILDREN, (request, response) => {
    const { numberOfChildren } = request.session;
    const errors = [];
    const values = {};
    for (let i = 0; i < numberOfChildren; i++) {
      const fieldName = import_formFields.default.CHILD_NAME + i;
      const value = typeof request.body[fieldName] === "string" ? request.body[fieldName].trim() : null;
      if (!value) {
        errors.push({
          location: "body",
          msg: request.__("aboutTheChildren.error"),
          path: fieldName,
          type: "field"
        });
      } else {
        values[fieldName] = value;
      }
    }
    if (errors.length > 0) {
      request.flash("errors", errors);
      request.flash("formValues", values);
      return response.redirect(import_paths.default.ABOUT_THE_CHILDREN);
    }
    request.session.namesOfChildren = Object.values(values);
    (0, import_addCompletedStep.default)(request, import_formSteps.default.ABOUT_THE_CHILDREN);
    return response.redirect(import_paths.default.ABOUT_THE_ADULTS);
  });
};
var aboutTheChildren_default = aboutTheChildrenRoutes;
//# sourceMappingURL=aboutTheChildren.js.map
