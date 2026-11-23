/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  ...require("./jest.config"),
  testMatch: [
    "<rootDir>/001-keyboard-animation.e2e.ts",
    "<rootDir>/002-enabled-disabled.e2e.ts",
    "<rootDir>/011-over-keyboard-view.e2e.ts",
  ],
};
