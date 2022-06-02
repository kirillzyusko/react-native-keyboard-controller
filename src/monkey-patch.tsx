import { NativeModules, Platform } from 'react-native';
// @ts-expect-error because there is no corresponding type definition
import * as NativeAndroidManager from 'react-native/Libraries/Components/StatusBar/NativeStatusBarManagerAndroid';

const getConstants = NativeAndroidManager.default.getConstants;

const RCTStatusBarManagerCompat = NativeModules.StatusBarManagerCompat;

// On Android < 11 RN uses legacy API which breaks EdgeToEdge mode in RN, so
// in order to use library on all available platforms we have to monkey patch
// default RN implementation and use modern `WindowInsetsControllerCompat`.
if (Platform.OS === 'android') {
  NativeAndroidManager.default = {
    getConstants,
    setColor(color: number, animated: boolean): void {
      console.log(color, animated);
      RCTStatusBarManagerCompat.setColor(color, animated);
    },

    setTranslucent(translucent: boolean): void {
      console.log(translucent);
      RCTStatusBarManagerCompat.setTranslucent(translucent);
    },

    /**
     *  - statusBarStyles can be:
     *    - 'default'
     *    - 'dark-content'
     */
    setStyle(statusBarStyle?: string): void {
      console.log(statusBarStyle);
      RCTStatusBarManagerCompat.setStyle(statusBarStyle);
    },

    setHidden(hidden: boolean): void {
      console.log(hidden);
      RCTStatusBarManagerCompat.setHidden(hidden);
    },
  };
}
