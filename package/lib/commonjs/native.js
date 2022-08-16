"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useResizeMode = exports.KeyboardEvents = exports.KeyboardControllerView = exports.KeyboardController = exports.AndroidSoftInputModes = void 0;

var _react = require("react");

var _reactNative = require("react-native");

const LINKING_ERROR = `The package 'react-native-keyboard-controller' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
let AndroidSoftInputModes;
exports.AndroidSoftInputModes = AndroidSoftInputModes;

(function (AndroidSoftInputModes) {
  AndroidSoftInputModes[AndroidSoftInputModes["SOFT_INPUT_ADJUST_NOTHING"] = 48] = "SOFT_INPUT_ADJUST_NOTHING";
  AndroidSoftInputModes[AndroidSoftInputModes["SOFT_INPUT_ADJUST_PAN"] = 32] = "SOFT_INPUT_ADJUST_PAN";
  AndroidSoftInputModes[AndroidSoftInputModes["SOFT_INPUT_ADJUST_RESIZE"] = 16] = "SOFT_INPUT_ADJUST_RESIZE";
  AndroidSoftInputModes[AndroidSoftInputModes["SOFT_INPUT_ADJUST_UNSPECIFIED"] = 0] = "SOFT_INPUT_ADJUST_UNSPECIFIED";
})(AndroidSoftInputModes || (exports.AndroidSoftInputModes = AndroidSoftInputModes = {}));

const ComponentName = 'KeyboardControllerView';
const RCTKeyboardController = _reactNative.NativeModules.KeyboardController;
const KeyboardController = RCTKeyboardController;
exports.KeyboardController = KeyboardController;
const eventEmitter = new _reactNative.NativeEventEmitter(RCTKeyboardController);
const KeyboardEvents = {
  addListener: (name, cb) => eventEmitter.addListener('KeyboardController::' + name, cb)
};
exports.KeyboardEvents = KeyboardEvents;
const KeyboardControllerView = _reactNative.UIManager.getViewManagerConfig(ComponentName) != null ? (0, _reactNative.requireNativeComponent)(ComponentName) : () => {
  throw new Error(LINKING_ERROR);
};
exports.KeyboardControllerView = KeyboardControllerView;

const useResizeMode = () => {
  (0, _react.useEffect)(() => {
    KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);
    return () => KeyboardController.setDefaultMode();
  }, []);
};

exports.useResizeMode = useResizeMode;
//# sourceMappingURL=native.js.map