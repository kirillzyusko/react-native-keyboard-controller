/// <reference types="react-native-reanimated" />
import { Animated } from 'react-native';
export declare const defaultAndroidEasing: import("react-native").EasingFunction;
declare type KeyboardAnimation = {
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
export declare const useKeyboardAnimationReplica: () => KeyboardAnimation;
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
export declare const useReanimatedKeyboardAnimationReplica: () => {
    height: import("react-native-reanimated").SharedValue<number>;
    progress: Readonly<{
        value: number;
    }>;
};
export declare const useGradualKeyboardAnimation: () => {
    height: import("react-native-reanimated").SharedValue<number>;
    progress: Readonly<{
        value: number;
    }>;
};
export {};
