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

const setKeyboardVisibleHeight = (height: number) => {
  keyboardVisibleHeight = height;
};
const setKeyboardPosition = (height: number) => {
  const progress = height / keyboardVisibleHeight;

  values.animated.progress.setValue(progress);
  values.animated.height.setValue(height);
  values.reanimated.height.value = height;
  values.reanimated.progress.value = progress;
};

const mock = {
  // hooks
  useKeyboardAnimation: () => values.animated,
  useReanimatedKeyboardAnimation: () => values.reanimated,
  useKeyboardAnimationReplica: () => values.animated,
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
  KeyboardControllerView: () => <></>,
  // mocks
  setKeyboardVisibleHeight,
  setKeyboardPosition,
};

module.exports = mock;
