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
var cacheClient_exports = {};
__export(cacheClient_exports, {
  default: () => cacheClient_default
});
module.exports = __toCommonJS(cacheClient_exports);
var import_redis = require("redis");
var import_config = __toESM(require("../config"));
var import_logger = __toESM(require("../logging/logger"));
const url = `${import_config.default.cache.tls_enabled ? "rediss" : "redis"}://${import_config.default.cache.host}`;
const createCacheClient = () => {
  const client = (0, import_redis.createClient)({
    url,
    password: import_config.default.cache.password,
    socket: {
      reconnectStrategy: (attempts) => {
        const nextDelay = Math.min(2 ** attempts * 20, 3e4);
        import_logger.default.info(`Retry cache connection attempt: ${attempts}, next attempt in: ${nextDelay}ms`);
        return nextDelay;
      }
    }
  });
  client.on("error", (e) => import_logger.default.error("Cache client error", e));
  return client;
};
var cacheClient_default = createCacheClient;
//# sourceMappingURL=cacheClient.js.map
