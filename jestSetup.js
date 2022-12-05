// jest.mock('./src/native', () => require('./src/mocks'));
// console.log(1);
jest.mock('react-native-keyboard-controller', () => ({
  // hooks
  useKeyboardAnimation: () => ({}),
  useReanimatedKeyboardAnimation: () => ({}),
  useKeyboardAnimationReplica: () => ({}),
  useResizeMode: () => ({}),
  useGenericKeyboardHandler: () => {},
  useKeyboardHandler: () => {},
  // modules
  KeyboardController: {
    setInputMode: () => {},
    setDefaultMode: () => {},
  },
  KeyboardEvents: {
    addListener: () => ({ remove: () => {} }),
  },
  // views
  KeyboardControllerView: () => <></>,
  // providers
}));
