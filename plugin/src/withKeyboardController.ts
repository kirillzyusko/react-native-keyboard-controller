import { ConfigPlugin, createRunOncePlugin } from '@expo/config-plugins';

const pkg = require('react-native-keyboard-controller/package.json');

const withKeyboardController: ConfigPlugin = (config) => config;

export default createRunOncePlugin(
  withKeyboardController,
  pkg.name,
  pkg.version
);
