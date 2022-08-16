"use strict";

var _reactNative = require("react-native");

var NativeAndroidManager = _interopRequireWildcard(require("react-native/Libraries/Components/StatusBar/NativeStatusBarManagerAndroid"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// @ts-expect-error because there is no corresponding type definition
const getConstants = NativeAndroidManager.default.getConstants;
const RCTStatusBarManagerCompat = _reactNative.NativeModules.StatusBarManagerCompat; // On Android < 11 RN uses legacy API which breaks EdgeToEdge mode in RN, so
// in order to use library on all available platforms we have to monkey patch
// default RN implementation and use modern `WindowInsetsControllerCompat`.

if (_reactNative.Platform.OS === 'android') {
  NativeAndroidManager.default = {
    getConstants,

    setColor(color, animated) {
      RCTStatusBarManagerCompat.setColor(color, animated);
    },

    setTranslucent(translucent) {
      RCTStatusBarManagerCompat.setTranslucent(translucent);
    },

    /**
     *  - statusBarStyles can be:
     *    - 'default'
     *    - 'dark-content'
     */
    setStyle(statusBarStyle) {
      RCTStatusBarManagerCompat.setStyle(statusBarStyle);
    },

    setHidden(hidden) {
      RCTStatusBarManagerCompat.setHidden(hidden);
    }

  };
}
//# sourceMappingURL=monkey-patch.js.map