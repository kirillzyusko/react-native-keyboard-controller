import React, { useContext, useMemo, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Reanimated, { useEvent, useHandler, useSharedValue } from 'react-native-reanimated';
import { KeyboardControllerView, useResizeMode } from './native';
const KeyboardControllerViewAnimated = Reanimated.createAnimatedComponent(Animated.createAnimatedComponent(KeyboardControllerView));
const defaultContext = {
  animated: {
    progress: new Animated.Value(0),
    height: new Animated.Value(0)
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
export const KeyboardContext = /*#__PURE__*/React.createContext(defaultContext);
export const useKeyboardAnimation = () => {
  useResizeMode();
  const context = useContext(KeyboardContext);
  return context.animated;
};
export const useReanimatedKeyboardAnimation = () => {
  useResizeMode();
  const context = useContext(KeyboardContext);
  return context.reanimated;
};

function useAnimatedKeyboardHandler(handlers, dependencies) {
  const {
    context,
    doDependenciesDiffer
  } = useHandler(handlers, dependencies);
  return useEvent(event => {
    'worklet';

    const {
      onKeyboardMove
    } = handlers;

    if (onKeyboardMove && event.eventName.endsWith('onKeyboardMove')) {
      onKeyboardMove(event, context);
    }
  }, ['onKeyboardMove'], doDependenciesDiffer);
}

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  hidden: {
    display: 'none',
    position: 'absolute'
  }
});
export const KeyboardProvider = _ref => {
  let {
    children,
    statusBarTranslucent
  } = _ref;
  const progress = useRef(new Animated.Value(0)).current;
  const height = useRef(new Animated.Value(0)).current;
  const progressSV = useSharedValue(0);
  const heightSV = useSharedValue(0);
  const context = useMemo(() => ({
    animated: {
      progress: progress,
      height: height
    },
    reanimated: {
      progress: progressSV,
      height: heightSV
    }
  }), []);
  const style = useMemo(() => [styles.hidden, {
    transform: [{
      translateX: height
    }, {
      translateY: progress
    }]
  }], []);
  const onKeyboardMove = useMemo(() => Animated.event([{
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
  return /*#__PURE__*/React.createElement(KeyboardContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(KeyboardControllerViewAnimated, {
    onKeyboardMoveReanimated: handler,
    onKeyboardMove: onKeyboardMove,
    statusBarTranslucent: statusBarTranslucent,
    style: styles.container
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Animated.View, {
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
//# sourceMappingURL=animated.js.map