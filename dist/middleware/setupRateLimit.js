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
var setupRateLimit_exports = {};
__export(setupRateLimit_exports, {
  default: () => setupRateLimit_default
});
module.exports = __toCommonJS(setupRateLimit_exports);
var import_express = require("express");
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var import_config = __toESM(require("../config"));
var import_redisStoreFactory = __toESM(require("../utils/redisStoreFactory"));
const setupRateLimit = () => {
  const router = (0, import_express.Router)();
  const isTestEnvironment = process.env.NODE_ENV === "test";
  const rateLimitHandler = (request, response) => {
    const { production } = import_config.default;
    response.status(429).render("pages/errors/rateLimit", {
      production: import_config.default.production,
      title: production ? request.__("errors.rateLimit.title") : "Too many requests"
    });
  };
  const generalLimiter = (0, import_express_rate_limit.default)({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: isTestEnvironment ? 15e3 : 250,
    // Much higher limit for tests to avoid false failures
    standardHeaders: true,
    // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
    // Disable the `X-RateLimit-*` headers
    validate: { trustProxy: true },
    keyGenerator: (req) => {
      return req.ip || "unknown";
    },
    store: (0, import_redisStoreFactory.default)("general:"),
    skip: (req) => {
      return "/health" === req.path || req.path.startsWith("/assets");
    },
    handler: rateLimitHandler
  });
  const downloadLimiter = (0, import_express_rate_limit.default)({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: isTestEnvironment ? 1e3 : 20,
    // Higher limit for tests
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: true },
    keyGenerator: (req) => {
      return req.ip || "unknown";
    },
    store: (0, import_redisStoreFactory.default)("download:"),
    handler: rateLimitHandler,
    skipSuccessfulRequests: false
    // Count all requests, even successful ones
  });
  const authLimiter = (0, import_express_rate_limit.default)({
    windowMs: 15 * 60 * 1e3,
    max: isTestEnvironment ? 1e3 : 10,
    // Higher limit for tests
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: true },
    keyGenerator: (req) => {
      return req.ip || "unknown";
    },
    store: (0, import_redisStoreFactory.default)("auth:"),
    handler: rateLimitHandler,
    skipSuccessfulRequests: true
    // Only count failed requests
  });
  router.use("/download-pdf", downloadLimiter);
  router.use("/download-html", downloadLimiter);
  router.use("/print-pdf", downloadLimiter);
  router.use("/download-paper-form", downloadLimiter);
  router.use("/password", authLimiter);
  router.use(generalLimiter);
  return router;
};
var setupRateLimit_default = setupRateLimit;
//# sourceMappingURL=setupRateLimit.js.map
