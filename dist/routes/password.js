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
var password_exports = {};
__export(password_exports, {
  default: () => password_default
});
module.exports = __toCommonJS(password_exports);
var import_express_validator = require("express-validator");
var import_config = __toESM(require("../config"));
var import_cookieNames = __toESM(require("../constants/cookieNames"));
var import_formFields = __toESM(require("../constants/formFields"));
var import_paths = __toESM(require("../constants/paths"));
var import_logger = __toESM(require("../logging/logger"));
var import_encryptPassword = __toESM(require("../utils/encryptPassword"));
var import_redirectValidator = require("../utils/redirectValidator");
const passwordRoutes = (router) => {
  router.get(import_paths.default.PASSWORD, handleGetPassword);
  router.post(
    import_paths.default.PASSWORD,
    (0, import_express_validator.body)(import_formFields.default.PASSWORD).custom((submittedPassword) => {
      return import_config.default.passwords.some((p) => submittedPassword === p);
    }).withMessage("The password is not correct"),
    handlePostPassword
  );
};
const handlePostPassword = (request, response) => {
  const providedUrl = typeof request.body.returnURL === "string" ? request.body.returnURL : null;
  const processedRedirectUrl = (0, import_redirectValidator.validateRedirectUrl)(providedUrl, import_paths.default.START);
  const errors = (0, import_express_validator.validationResult)(request);
  if (errors.isEmpty()) {
    response.cookie(import_cookieNames.default.AUTHENTICATION, (0, import_encryptPassword.default)(request.body.password), {
      maxAge: 1e3 * 60 * 60 * 24 * 30,
      // 30 days
      secure: import_config.default.useHttps,
      httpOnly: true,
      sameSite: "lax"
    });
    import_logger.default.info(`Received successful login request`);
    return response.redirect(processedRedirectUrl.replace(/^\/+/, "/"));
  }
  request.flash("errors", errors.array());
  return response.redirect(`${import_paths.default.PASSWORD}?returnURL=${encodeURIComponent(processedRedirectUrl)}`);
};
const handleGetPassword = async (request, response) => {
  const providedReturnURL = typeof request.query.returnURL === "string" ? request.query.returnURL : void 0;
  const returnURL = (0, import_redirectValidator.validateRedirectUrl)(providedReturnURL, import_paths.default.START);
  response.render("pages/password", { returnURL, errors: request.flash("errors"), title: "Sign in" });
};
var password_default = passwordRoutes;
//# sourceMappingURL=password.js.map
