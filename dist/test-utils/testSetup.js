var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_jest_dom = require("@testing-library/jest-dom");
var import_path = __toESM(require("path"));
var import_i18n = __toESM(require("i18n"));
var import_config = __toESM(require("../config"));
var import_testMocks = require("./testMocks");
jest.mock("../logging/logger", () => import_testMocks.loggerMocks);
jest.mock("../middleware/checkFormProgressFromConfig", () => import_testMocks.mockCheckFormProgressFromConfig);
beforeAll(() => {
  import_i18n.default.configure({
    defaultLocale: "en",
    locales: ["en"],
    directory: import_path.default.resolve(__dirname, "../locales"),
    updateFiles: false,
    objectNotation: true
  });
});
beforeEach(() => {
  import_testMocks.flashMockErrors.length = 0;
  import_testMocks.flashFormValues.length = 0;
  Object.keys(import_testMocks.sessionMock).forEach((key) => delete import_testMocks.sessionMock[key]);
  jest.useFakeTimers({ advanceTimers: true }).setSystemTime(import_testMocks.mockNow);
  import_config.default.useAuth = false;
  import_testMocks.mockCheckFormProgressFromConfig.mockClear();
});
afterEach(() => {
  jest.clearAllMocks();
});
//# sourceMappingURL=testSetup.js.map
