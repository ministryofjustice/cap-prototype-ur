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
var findError_exports = {};
__export(findError_exports, {
  default: () => findError_default
});
module.exports = __toCommonJS(findError_exports);
const findError = (errors, formFieldId) => {
  if (!errors) return null;
  const errorForMessage = errors.find((error) => error.path === formFieldId);
  if (errorForMessage === void 0) return null;
  return {
    text: errorForMessage?.msg
  };
};
var findError_default = findError;
//# sourceMappingURL=findError.js.map
