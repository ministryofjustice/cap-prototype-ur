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
var base_exports = {};
__export(base_exports, {
  default: () => base_default
});
module.exports = __toCommonJS(base_exports);
class Base {
  pdf;
  constructor(pdf) {
    this.pdf = pdf;
  }
  addComponentToDocument() {
    if (this.pdf.heightWillOverflowDocument(this.getComponentHeight())) {
      this.handleComponentOverflowingPage();
    } else {
      this.createComponent();
    }
  }
}
var base_default = Base;
//# sourceMappingURL=base.js.map
