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
var setUpWebSession_exports = {};
__export(setUpWebSession_exports, {
  default: () => setUpWebSession_default
});
module.exports = __toCommonJS(setUpWebSession_exports);
var import_connect_flash = __toESM(require("connect-flash"));
var import_connect_redis = require("connect-redis");
var import_express = require("express");
var import_express_session = __toESM(require("express-session"));
var import_config = __toESM(require("../config"));
var import_cookieNames = __toESM(require("../constants/cookieNames"));
var import_cacheClient = __toESM(require("../data/cacheClient"));
var import_logger = __toESM(require("../logging/logger"));
;
const setUpWebSession = () => {
  let store;
  if (import_config.default.cache.enabled) {
    const client = (0, import_cacheClient.default)();
    client.connect().catch((err) => import_logger.default.error(`Error connecting to cache`, err));
    store = new import_connect_redis.RedisStore({ client });
  } else {
    store = new import_express_session.MemoryStore();
  }
  const router = (0, import_express.Router)();
  router.use(
    (0, import_express_session.default)({
      store,
      name: import_cookieNames.default.SESSION,
      cookie: { secure: import_config.default.useHttps, sameSite: "lax", maxAge: import_config.default.session.expiryMinutes * 60 * 1e3 },
      secret: import_config.default.session.secret,
      resave: true,
      // Ensures session is saved on every request, preventing race conditions with Redis
      saveUninitialized: false,
      rolling: true
    })
  );
  router.use((request, _, next) => {
    request.session.nowInMinutes = Math.floor(Date.now() / 6e4);
    next();
  });
  router.use((0, import_connect_flash.default)());
  return router;
};
var setUpWebSession_default = setUpWebSession;
//# sourceMappingURL=setUpWebSession.js.map
