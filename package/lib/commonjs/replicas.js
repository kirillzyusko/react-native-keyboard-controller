"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useReanimatedKeyboardAnimationReplica = exports.useKeyboardAnimationReplica = exports.useGradualKeyboardAnimation = exports.defaultAndroidEasing = void 0;

var _react = require("react");

var _reactNative = require("react-native");

var _reactNativeReanimated = require("react-native-reanimated");

var _animated = require("./animated");

var _native = require("./native");

const availableOSEventType = _reactNative.Platform.OS === 'ios' ? 'Will' : 'Did'; // cubic-bezier(.17,.67,.34,.94)

const defaultAndroidEasing = _reactNative.Easing.bezier(0.4, 0.0, 0.2, 1);

exports.defaultAndroidEasing = defaultAndroidEasing;

/**
 * An experimental implementation of tracing keyboard appearance.
 * Switch an input mode to adjust resize mode. In this case all did* events
 * are triggering before keyboard appears, and using some approximations
 * it tries to mimicries a native transition.
 *
 * @returns {Animated.Value}
 */
const useKeyboardAnimationReplica = () => {
  const height = (0, _react.useRef)(new _reactNative.Animated.Value(0));
  const progress = (0, _react.useRef)(new _reactNative.Animated.Value(0));
  const animation = (0, _react.useMemo)(() => ({
    height: height.current,
    progress: progress.current
  }), []);
  (0, _react.useEffect)(() => {
    _native.KeyboardController.setInputMode(_native.AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);

    return () => _native.KeyboardController.setDefaultMode();
  }, []);
  (0, _react.useEffect)(() => {
    const listener = _reactNative.Keyboard.addListener(`keyboard${availableOSEventType}Show`, e => {
      _reactNative.Animated.timing(height.current, {
        toValue: -e.endCoordinates.height,
        duration: e.duration !== 0 ? e.duration : 300,
        easing: _reactNative.Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true
      }).start();

      return () => listener.remove();
    });
  }, []);
  (0, _react.useEffect)(() => {
    const listener = _reactNative.Keyboard.addListener(`keyboard${availableOSEventType}Hide`, e => {
      _reactNative.Animated.timing(height.current, {
        toValue: 0,
        duration: e.duration !== 0 ? e.duration : 300,
        easing: _reactNative.Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true
      }).start();

      return () => listener.remove();
    });
  }, []);
  return animation;
};

exports.useKeyboardAnimationReplica = useKeyboardAnimationReplica;
const IOS_SPRING_CONFIG = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10
};
/**
 * A close replica to native iOS keyboard animation. The problem is that
 * iOS (unlike Android) can not fire events for each keyboard frame movement.
 * As a result we can not get gradual values (for example, for progress it always
 * will be 1 or 0). So if you want to rely on gradual values you will need to use
 * this replica.
 *
 * The transition is hardcoded and may vary from one to another OS versions. But it
 * seems like last time it has been changed in iOS 7. Since RN supports at least iOS
 * 11 it doesn't make sense to replicate iOS 7 behavior. If it changes in next OS
 * versions, then this implementation should be revisited and reflect necessary changes.
 *
 * @returns {height, progress} - animated values
 */

const useReanimatedKeyboardAnimationReplica = () => {
  const height = (0, _reactNativeReanimated.useSharedValue)(0);
  const heightEvent = (0, _reactNativeReanimated.useSharedValue)(0);
  const progress = (0, _reactNativeReanimated.useDerivedValue)(() => height.value / heightEvent.value);
  const handler = (0, _reactNativeReanimated.useWorkletCallback)(_height => {
    heightEvent.value = _height;
  }, []);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => ({
    _keyboardHeight: heightEvent.value
  }), (result, _previousResult) => {
    const {
      _keyboardHeight
    } = result;

    const _previousKeyboardHeight = _previousResult === null || _previousResult === void 0 ? void 0 : _previousResult._keyboardHeight;

    if (_keyboardHeight !== _previousKeyboardHeight) {
      height.value = (0, _reactNativeReanimated.withSpring)(_keyboardHeight, IOS_SPRING_CONFIG);
    }
  }, []);
  (0, _react.useEffect)(() => {
    const show = _reactNative.Keyboard.addListener('keyboardWillShow', e => {
      (0, _reactNativeReanimated.runOnUI)(handler)(-e.endCoordinates.height);
    });

    const hide = _reactNative.Keyboard.addListener('keyboardWillHide', () => {
      (0, _reactNativeReanimated.runOnUI)(handler)(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return {
    height,
    progress
  };
};

exports.useReanimatedKeyboardAnimationReplica = useReanimatedKeyboardAnimationReplica;
const useGradualKeyboardAnimation = _reactNative.Platform.OS === 'ios' ? useReanimatedKeyboardAnimationReplica : _animated.useReanimatedKeyboardAnimation;
exports.useGradualKeyboardAnimation = useGradualKeyboardAnimation;
//# sourceMappingURL=replicas.js.map