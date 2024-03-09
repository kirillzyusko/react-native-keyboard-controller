// @ts-expect-error because there is no corresponding type definition
import * as NativeAndroidManager from "react-native/Libraries/Components/StatusBar/NativeStatusBarManagerAndroid";

const RCTStatusBarManagerCompat =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("./specs/NativeStatusBarManagerCompat").default;

// Copy original default manager to keep its original state and methods
const OriginalNativeAndroidManager = { ...NativeAndroidManager.default };

// Create a new object that modifies the necessary methods
// On Android < 11 RN uses legacy API which breaks EdgeToEdge mode in RN, so
// in order to use library on all available platforms we have to monkey patch
// default RN implementation and use modern `WindowInsetsControllerCompat`.
const ModifiedNativeAndroidManager = {
  ...NativeAndroidManager.default, // Spread original properties to keep existing functionality
  setColor: (color: number, animated: boolean): void => {
    RCTStatusBarManagerCompat.setColor(color, animated);
  },
  setTranslucent: (translucent: boolean): void => {
    RCTStatusBarManagerCompat.setTranslucent(translucent);
  },
  /**
   *  - statusBarStyles can be:
   *    - 'default'
   *    - 'dark-content'
   */
  setStyle: (statusBarStyle?: string): void => {
    RCTStatusBarManagerCompat.setStyle(statusBarStyle);
  },
  setHidden: (hidden: boolean): void => {
    RCTStatusBarManagerCompat.setHidden(hidden);
  },
};

// Define a function to apply the monkey patch
export const applyMonkeyPatch = () => {
  Object.assign(NativeAndroidManager.default, ModifiedNativeAndroidManager);
};

// Define a function to revert changes back to the original state
export const revertMonkeyPatch = () => {
  Object.assign(NativeAndroidManager.default, OriginalNativeAndroidManager);
};
