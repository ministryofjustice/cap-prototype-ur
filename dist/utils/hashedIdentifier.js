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
var hashedIdentifier_exports = {};
__export(hashedIdentifier_exports, {
  generateHashedIdentifier: () => generateHashedIdentifier,
  getDailySalt: () => getDailySalt
});
module.exports = __toCommonJS(hashedIdentifier_exports);
var import_crypto = __toESM(require("crypto"));
var import_config = __toESM(require("../config"));
var import_logger = __toESM(require("../logging/logger"));
const getDailySalt = () => {
  const now = /* @__PURE__ */ new Date();
  const dateKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
  return dateKey;
};
const generateHashedIdentifier = (ip, userAgent, salt) => {
  const actualSalt = salt || getDailySalt();
  const data = `${ip || "unknown"}-${userAgent || "unknown"}-${actualSalt}`;
  const secret = import_config.default.analytics.hashSecret;
  if (!secret) {
    import_logger.default.error("HASH_SECRET environment variable is not set");
    return "unknown";
  }
  return import_crypto.default.createHmac("sha256", secret).update(data).digest("hex").substring(0, 16);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateHashedIdentifier,
  getDailySalt
});
//# sourceMappingURL=hashedIdentifier.js.map
