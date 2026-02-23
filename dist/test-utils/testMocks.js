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
var testMocks_exports = {};
__export(testMocks_exports, {
  flashFormValues: () => flashFormValues,
  flashMock: () => flashMock,
  flashMockErrors: () => flashMockErrors,
  loggerMocks: () => loggerMocks,
  mockCheckFormProgressFromConfig: () => mockCheckFormProgressFromConfig,
  mockNow: () => mockNow,
  sessionMock: () => sessionMock
});
module.exports = __toCommonJS(testMocks_exports);
const loggerMocks = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn()
};
const flashMockErrors = [];
const flashFormValues = [];
const flashMock = jest.fn().mockImplementation((type) => type === "errors" ? flashMockErrors : flashFormValues);
const sessionMock = {};
const mockNow = /* @__PURE__ */ new Date("2025-01-01T00:00:00Z");
const mockCheckFormProgressFromConfig = jest.fn().mockImplementation(() => (_req, _res, next) => next());
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  flashFormValues,
  flashMock,
  flashMockErrors,
  loggerMocks,
  mockCheckFormProgressFromConfig,
  mockNow,
  sessionMock
});
//# sourceMappingURL=testMocks.js.map
