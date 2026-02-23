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
var urlize_exports = {};
__export(urlize_exports, {
  default: () => urlize_default
});
module.exports = __toCommonJS(urlize_exports);
const punctuationRegex = /^(\(|<|&lt;)?(.*?)(\.|,|\)|\n|&gt;)?$/;
const emailRegex = /^[\w.!#$%&'*+\-/=?^`{|}~]+@[a-z\d-]+(\.[a-z\d-]+)+$/i;
const httpHttpsRegex = /^https?:\/\/.*$/;
const urlize = (string) => {
  const words = string.split(/(\s+)/).filter((word) => word?.length).map((word) => {
    let leadingPunctuation = "";
    let trailingPunctuation = "";
    let possibleUrl = word;
    const matches = RegExp(punctuationRegex).exec(word);
    if (matches) {
      leadingPunctuation = matches[1] || "";
      possibleUrl = matches[2];
      trailingPunctuation = matches[3] || "";
    }
    if (httpHttpsRegex.test(possibleUrl)) {
      return `${leadingPunctuation}<a href="${possibleUrl}">${possibleUrl}</a>${trailingPunctuation}`;
    }
    if (emailRegex.test(possibleUrl)) {
      return `${leadingPunctuation}<a href="mailto:${possibleUrl}">${possibleUrl}</a>${trailingPunctuation}`;
    }
    return word;
  });
  return words.join("");
};
var urlize_default = urlize;
//# sourceMappingURL=urlize.js.map
