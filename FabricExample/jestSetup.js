import "react-native-gesture-handler/jestSetup";

require("react-native-reanimated/lib/module/jestUtils").setUpTests();

jest.mock("react-native-keyboard-controller", () =>
  require("react-native-keyboard-controller/jest"),
);

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);
