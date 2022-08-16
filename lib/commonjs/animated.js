"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useReanimatedKeyboardAnimation = exports.useKeyboardAnimation = exports.styles = exports.KeyboardProvider = exports.KeyboardContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _native = require("./native");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const KeyboardControllerViewAnimated = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.Animated.createAnimatedComponent(_native.KeyboardControllerView));

const defaultContext = {
  animated: {
    progress: new _reactNative.Animated.Value(0),
    height: new _reactNative.Animated.Value(0)
  },
  reanimated: {
    progress: {
      value: 0
    },
    height: {
      value: 0
    }
  }
};

const KeyboardContext = /*#__PURE__*/_react.default.createContext(defaultContext);

exports.KeyboardContext = KeyboardContext;

const useKeyboardAnimation = () => {
  (0, _native.useResizeMode)();
  const context = (0, _react.useContext)(KeyboardContext);
  return context.animated;
};

exports.useKeyboardAnimation = useKeyboardAnimation;

const useReanimatedKeyboardAnimation = () => {
  (0, _native.useResizeMode)();
  const context = (0, _react.useContext)(KeyboardContext);
  return context.reanimated;
};

exports.useReanimatedKeyboardAnimation = useReanimatedKeyboardAnimation;

function useAnimatedKeyboardHandler(handlers, dependencies) {
  const {
    context,
    doDependenciesDiffer
  } = (0, _reactNativeReanimated.useHandler)(handlers, dependencies);
  return (0, _reactNativeReanimated.useEvent)(event => {
    'worklet';

    const {
      onKeyboardMove
    } = handlers;

    if (onKeyboardMove && event.eventName.endsWith('onKeyboardMove')) {
      onKeyboardMove(event, context);
    }
  }, ['onKeyboardMove'], doDependenciesDiffer);
}

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  hidden: {
    display: 'none',
    position: 'absolute'
  }
});

exports.styles = styles;

const KeyboardProvider = _ref => {
  let {
    children,
    statusBarTranslucent
  } = _ref;
  const progress = (0, _react.useRef)(new _reactNative.Animated.Value(0)).current;
  const height = (0, _react.useRef)(new _reactNative.Animated.Value(0)).current;
  const progressSV = (0, _reactNativeReanimated.useSharedValue)(0);
  const heightSV = (0, _reactNativeReanimated.useSharedValue)(0);
  const context = (0, _react.useMemo)(() => ({
    animated: {
      progress: progress,
      height: height
    },
    reanimated: {
      progress: progressSV,
      height: heightSV
    }
  }), []);
  const style = (0, _react.useMemo)(() => [styles.hidden, {
    transform: [{
      translateX: height
    }, {
      translateY: progress
    }]
  }], []);
  const onKeyboardMove = (0, _react.useMemo)(() => _reactNative.Animated.event([{
    nativeEvent: {
      progress,
      height
    }
  }], {
    useNativeDriver: true
  }), []);
  const handler = useAnimatedKeyboardHandler({
    onKeyboardMove: event => {
      'worklet';

      progressSV.value = event.progress;
      heightSV.value = event.height;
    }
  }, []);
  return /*#__PURE__*/_react.default.createElement(KeyboardContext.Provider, {
    value: context
  }, /*#__PURE__*/_react.default.createElement(KeyboardControllerViewAnimated, {
    onKeyboardMoveReanimated: handler,
    onKeyboardMove: onKeyboardMove,
    statusBarTranslucent: statusBarTranslucent,
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
    // we are using this small hack, because if the component (where
    // animated value has been used) is unmounted, then animation will
    // stop receiving events (seems like it's react-native optimization).
    // So we need to keep a reference to the animated value, to keep it's
    // always mounted (keep a reference to an animated value).
    //
    // To test why it's needed, try to open screen which consumes Animated.Value
    // then close it and open it again (for example 'Animated transition').
    style: style
  }), children)));
};

exports.KeyboardProvider = KeyboardProvider;
//# sourceMappingURL=animated.js.map