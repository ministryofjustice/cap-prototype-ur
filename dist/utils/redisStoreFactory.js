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
var redisStoreFactory_exports = {};
__export(redisStoreFactory_exports, {
  default: () => redisStoreFactory_default
});
module.exports = __toCommonJS(redisStoreFactory_exports);
var import_rate_limit_redis = require("rate-limit-redis");
var import_config = __toESM(require("../config"));
var import_cacheClient = __toESM(require("../data/cacheClient"));
let redisClient;
if (import_config.default.cache.enabled) {
  redisClient = (0, import_cacheClient.default)();
  redisClient.connect().catch((err) => console.error(`Error connecting to cache`, err));
}
const createRedisStore = (prefix) => {
  if (import_config.default.cache.enabled && redisClient) {
    return new import_rate_limit_redis.RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix
      // Ensures unique keys for this specific limiter
    });
  }
  return void 0;
};
var redisStoreFactory_default = createRedisStore;
//# sourceMappingURL=redisStoreFactory.js.map
