// @ts-expect-error because there is no corresponding type definition
import * as NativeAndroidManager from "react-native/Libraries/Components/StatusBar/NativeStatusBarManagerAndroid";

const DefaultNativeAndroidManager = NativeAndroidManager.default;
const getConstants = NativeAndroidManager.default.getConstants;
const RCTStatusBarManagerCompat =
  require("./specs/NativeStatusBarManagerCompat").default;

// On Android < 11 RN uses legacy API which breaks EdgeToEdge mode in RN, so
// in order to use library on all available platforms we have to monkey patch
// default RN implementation and use modern `WindowInsetsControllerCompat`.
export const applyMonkeyPatch = () => {
  NativeAndroidManager.default = {
    getConstants,
    setColor(color: number, animated: boolean): void {
      RCTStatusBarManagerCompat.setColor(color, animated);
    },

    setTranslucent(translucent: boolean): void {
      RCTStatusBarManagerCompat.setTranslucent(translucent);
    },

    /**
     *  - statusBarStyles can be:
     *    - 'default'
     *    - 'dark-content'
     */
    setStyle(statusBarStyle?: string): void {
      RCTStatusBarManagerCompat.setStyle(statusBarStyle);
    },

    setHidden(hidden: boolean): void {
      RCTStatusBarManagerCompat.setHidden(hidden);
    },
  };
};
export const revertMonkeyPatch = () => {
  NativeAndroidManager.default = DefaultNativeAndroidManager;
};
