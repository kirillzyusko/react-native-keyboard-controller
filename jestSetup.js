require("react-native-reanimated/lib/module/jestUtils").setUpTests();

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);
