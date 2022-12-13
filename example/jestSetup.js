import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest')
);
