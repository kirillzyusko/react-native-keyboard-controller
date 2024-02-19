import { Animated, ScrollView, View } from "react-native";

const values = {
  animated: {
    progress: new Animated.Value(0),
    height: new Animated.Value(0),
  },
  reanimated: {
    progress: { value: 0 },
    height: { value: 0 },
  },
};
const focusedInput = {
  input: {
    value: {
      target: 1,
      parentScrollViewTarget: -1,
      layout: {
        x: 0,
        y: 0,
        width: 200,
        height: 40,
        absoluteX: 0,
        absoluteY: 100,
      },
    },
  },
};

const mock = {
  // hooks
  /// keyboard
  useKeyboardAnimation: jest.fn().mockReturnValue(values.animated),
  useReanimatedKeyboardAnimation: jest.fn().mockReturnValue(values.reanimated),
  useResizeMode: jest.fn(),
  useGenericKeyboardHandler: jest.fn(),
  useKeyboardHandler: jest.fn(),
  useKeyboardContext: jest.fn().mockReturnValue(values),
  /// input
  useReanimatedFocusedInput: jest.fn().mockReturnValue(focusedInput),
  useFocusedInputHandler: jest.fn(),
  /// module
  useKeyboardController: jest
    .fn()
    .mockReturnValue({ setEnabled: jest.fn(), enabled: true }),
  // modules
  KeyboardController: {
    setInputMode: jest.fn(),
    setDefaultMode: jest.fn(),
    dismiss: jest.fn(),
    setFocusTo: jest.fn(),
  },
  AndroidSoftInputModes: {
    SOFT_INPUT_ADJUST_NOTHING: 48,
    SOFT_INPUT_ADJUST_PAN: 32,
    SOFT_INPUT_ADJUST_RESIZE: 16,
    SOFT_INPUT_ADJUST_UNSPECIFIED: 0,
    SOFT_INPUT_IS_FORWARD_NAVIGATION: 256,
    SOFT_INPUT_MASK_ADJUST: 240,
    SOFT_INPUT_MASK_STATE: 15,
    SOFT_INPUT_MODE_CHANGED: 512,
    SOFT_INPUT_STATE_ALWAYS_HIDDEN: 3,
    SOFT_INPUT_STATE_ALWAYS_VISIBLE: 5,
    SOFT_INPUT_STATE_HIDDEN: 2,
    SOFT_INPUT_STATE_UNCHANGED: 1,
    SOFT_INPUT_STATE_UNSPECIFIED: 0,
    SOFT_INPUT_STATE_VISIBLE: 4,
  },
  KeyboardEvents: {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  // views
  KeyboardControllerView: "KeyboardControllerView",
  KeyboardGestureArea: "KeyboardGestureArea",
  // providers
  KeyboardProvider: "KeyboardProvider",
  // components
  KeyboardStickyView: View,
  KeyboardAvoidingView: View,
  KeyboardAwareScrollView: ScrollView,
  KeyboardToolbar: View,
};

module.exports = mock;
