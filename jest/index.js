const Animated = require('react-native/Libraries/Animated/Animated');

let keyboardVisibleHeight = 300;

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

const setKeyboardVisibleHeight = (height) => {
  keyboardVisibleHeight = height;
};
const setKeyboardPosition = (height) => {
  // to exclude negative values and values greater than `keyboardVisibleHeight`
  const normalizedHeight = Math.min(Math.max(height, 0), keyboardVisibleHeight);
  const progress = height / normalizedHeight;

  values.animated.progress.setValue(progress);
  values.animated.height.setValue(height);
  values.reanimated.height.value = height;
  values.reanimated.progress.value = progress;
};

const mock = {
  // hooks
  useKeyboardAnimation: jest.fn().mockReturnValue(values.animated),
  useReanimatedKeyboardAnimation: jest.fn().mockReturnValue(values.reanimated),
  useResizeMode: jest.fn(),
  useGenericKeyboardHandler: jest.fn(),
  useKeyboardHandler: jest.fn(),
  // modules
  KeyboardController: {
    setInputMode: jest.fn(),
    setDefaultMode: jest.fn(),
  },
  KeyboardEvents: {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  // views
  KeyboardControllerView: 'KeyboardControllerView',
  // providers
  KeyboardProvider: 'KeyboardProvider',
  // mocks
  setKeyboardVisibleHeight,
  setKeyboardPosition,
};

module.exports = mock;
