import type {
  useAnimatedKeyboardHandler as UseAnimatedKeyboardHandler,
  useFocusedInputLayoutHandler as UseFocusedInputLayoutHandler,
} from "../reanimated.native";

type ReanimatedNativeModule = {
  useAnimatedKeyboardHandler: typeof UseAnimatedKeyboardHandler;
  useFocusedInputLayoutHandler: typeof UseFocusedInputLayoutHandler;
};

it("does not forward web-only dependencies to native Reanimated handlers", () => {
  jest.resetModules();

  const mockUseEvent = jest.fn(() => jest.fn());
  const mockUseHandler = jest.fn(() => ({
    context: {},
    doDependenciesDiffer: false,
  }));

  jest.doMock("react-native-reanimated", () => ({
    useEvent: mockUseEvent,
    useHandler: mockUseHandler,
  }));

  const { useAnimatedKeyboardHandler, useFocusedInputLayoutHandler } =
    require("../reanimated.native") as ReanimatedNativeModule;

  const keyboardHandlers = {};
  const focusedInputHandlers = {};
  const dependencies = ["dependency"];

  useAnimatedKeyboardHandler(keyboardHandlers, dependencies);
  useFocusedInputLayoutHandler(focusedInputHandlers, dependencies);

  expect(mockUseHandler).toHaveBeenNthCalledWith(1, keyboardHandlers);
  expect(mockUseHandler).toHaveBeenNthCalledWith(2, focusedInputHandlers);
});
