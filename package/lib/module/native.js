import { useEffect } from 'react';
import { requireNativeComponent, UIManager, Platform, NativeModules, NativeEventEmitter } from 'react-native';
const LINKING_ERROR = `The package 'react-native-keyboard-controller' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
export let AndroidSoftInputModes;

(function (AndroidSoftInputModes) {
  AndroidSoftInputModes[AndroidSoftInputModes["SOFT_INPUT_ADJUST_NOTHING"] = 48] = "SOFT_INPUT_ADJUST_NOTHING";
  AndroidSoftInputModes[AndroidSoftInputModes["SOFT_INPUT_ADJUST_PAN"] = 32] = "SOFT_INPUT_ADJUST_PAN";
  AndroidSoftInputModes[AndroidSoftInputModes["SOFT_INPUT_ADJUST_RESIZE"] = 16] = "SOFT_INPUT_ADJUST_RESIZE";
  AndroidSoftInputModes[AndroidSoftInputModes["SOFT_INPUT_ADJUST_UNSPECIFIED"] = 0] = "SOFT_INPUT_ADJUST_UNSPECIFIED";
})(AndroidSoftInputModes || (AndroidSoftInputModes = {}));

const ComponentName = 'KeyboardControllerView';
const RCTKeyboardController = NativeModules.KeyboardController;
export const KeyboardController = RCTKeyboardController;
const eventEmitter = new NativeEventEmitter(RCTKeyboardController);
export const KeyboardEvents = {
  addListener: (name, cb) => eventEmitter.addListener('KeyboardController::' + name, cb)
};
export const KeyboardControllerView = UIManager.getViewManagerConfig(ComponentName) != null ? requireNativeComponent(ComponentName) : () => {
  throw new Error(LINKING_ERROR);
};
export const useResizeMode = () => {
  useEffect(() => {
    KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);
    return () => KeyboardController.setDefaultMode();
  }, []);
};
//# sourceMappingURL=native.js.map