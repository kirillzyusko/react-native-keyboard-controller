import { useRef, useEffect, useMemo } from 'react';
import { Animated, Easing, Keyboard, Platform } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';

import { AndroidSoftInputModes, KeyboardController } from './native';

const availableOSEventType = Platform.OS === 'ios' ? 'Will' : 'Did';

// cubic-bezier(.17,.67,.34,.94)
export const defaultAndroidEasing = Easing.bezier(0.4, 0.0, 0.2, 1);
type KeyboardAnimation = {
  progress: Animated.Value;
  height: Animated.Value;
};

/**
 * An experimental implementation of tracing keyboard appearance.
 * Switch an input mode to adjust resize mode. In this case all did* events
 * are triggering before keyboard appears, and using some approximations
 * it tries to mimicries a native transition.
 *
 * @returns {Animated.Value}
 */
export const useKeyboardAnimationReplica = (): KeyboardAnimation => {
  const height = useRef(new Animated.Value(0));
  const progress = useRef(new Animated.Value(0));
  const animation = useMemo(
    () => ({
      height: height.current,
      progress: progress.current,
    }),
    []
  );

  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
  useEffect(() => {
    const listener = Keyboard.addListener(
      `keyboard${availableOSEventType}Show`,
      (e) => {
        Animated.timing(height.current, {
          toValue: -e.endCoordinates.height,
          duration: e.duration !== 0 ? e.duration : 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }).start();

        return () => listener.remove();
      }
    );
  }, []);
  useEffect(() => {
    const listener = Keyboard.addListener(
      `keyboard${availableOSEventType}Hide`,
      (e) => {
        Animated.timing(height.current, {
          toValue: 0,
          duration: e.duration !== 0 ? e.duration : 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }).start();

        return () => listener.remove();
      }
    );
  }, []);

  return animation;
};

const IOS_SPRING_CONFIG = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
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
export const useReanimatedKeyboardAnimationReplica = () => {
  const height = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', (e) => {
      height.value = withSpring(-e.endCoordinates.height, IOS_SPRING_CONFIG);
      progress.value = withSpring(1, IOS_SPRING_CONFIG);
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      height.value = withSpring(0, IOS_SPRING_CONFIG);
      progress.value = withSpring(0, IOS_SPRING_CONFIG);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return { height, progress };
};
