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
var config_exports = {};
__export(config_exports, {
  default: () => config_default
});
module.exports = __toCommonJS(config_exports);
const production = process.env.NODE_ENV === "production";
const getStringConfigValue = (name) => {
  if (process.env[name]) {
    return process.env[name];
  }
  throw new Error(`Missing env var ${name}`);
};
const getBoolConfigValue = (name) => {
  return getStringConfigValue(name) === "true";
};
const getIntConfigValue = (name) => {
  return parseInt(getStringConfigValue(name), 10);
};
const getStringArray = (name) => getStringConfigValue(name).split(",");
const getCacheConfig = () => {
  const enabled = getBoolConfigValue("CACHE_ENABLED");
  if (enabled) {
    return {
      enabled: true,
      host: getStringConfigValue("CACHE_HOST"),
      password: getStringConfigValue("CACHE_PASSWORD"),
      tls_enabled: getBoolConfigValue("CACHE_TLS_ENABLED")
    };
  }
  return {
    enabled: false,
    host: void 0,
    password: void 0,
    tls_enabled: void 0
  };
};
const config = {
  buildNumber: getStringConfigValue("BUILD_NUMBER"),
  gitRef: getStringConfigValue("GIT_REF"),
  gitBranch: getStringConfigValue("GIT_BRANCH"),
  includeWelshLanguage: getBoolConfigValue("INCLUDE_WELSH_LANGUAGE"),
  production,
  useHttps: getBoolConfigValue("USE_HTTPS"),
  staticResourceCacheDuration: getStringConfigValue("STATIC_RESOURCE_CACHE_DURATION"),
  analytics: {
    ga4Id: process.env.GA4_ID,
    enabled: process.env.ENABLE_ANALYTICS !== "false",
    // Defaults to true unless explicitly disabled
    hashSecret: process.env.HASH_SECRET
  },
  cache: getCacheConfig(),
  session: {
    secret: getStringConfigValue("SESSION_SECRET"),
    expiryMinutes: getIntConfigValue("WEB_SESSION_TIMEOUT_IN_MINUTES")
  },
  passwords: getStringArray("BETA_ACCESS_PASSWORDS"),
  useAuth: getBoolConfigValue("USE_AUTH"),
  isLiveService: process.env.IS_LIVE_SERVICE === "true",
  feedbackUrl: getStringConfigValue("FEEDBACK_URL"),
  contactEmail: getStringConfigValue("CONTACT_EMAIL"),
  previewEnd: new Date(getStringConfigValue("PREVIEW_END"))
};
if (production) {
  if (!config.useHttps || !config.cache.tls_enabled) {
    throw new Error(`HTTPS must be enabled on production environments`);
  }
  if (!config.cache.enabled) {
    throw new Error(`Cache must be used on production environments`);
  }
}
var config_default = config;
//# sourceMappingURL=config.js.map
