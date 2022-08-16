import React from 'react';
import { Animated, ViewStyle } from 'react-native';
import Reanimated from 'react-native-reanimated';
declare type AnimatedContext = {
    progress: Animated.Value;
    height: Animated.Value;
};
declare type ReanimatedContext = {
    progress: Reanimated.SharedValue<number>;
    height: Reanimated.SharedValue<number>;
};
declare type KeyboardAnimationContext = {
    animated: AnimatedContext;
    reanimated: ReanimatedContext;
};
export declare const KeyboardContext: React.Context<KeyboardAnimationContext>;
export declare const useKeyboardAnimation: () => AnimatedContext;
export declare const useReanimatedKeyboardAnimation: () => ReanimatedContext;
declare type Styles = {
    container: ViewStyle;
    hidden: ViewStyle;
};
export declare const styles: Styles;
declare type KeyboardProviderProps = {
    children: React.ReactNode;
    /**
     * Set the value to `true`, if you use translucent status bar on Android.
     * If you already control status bar translucency via `react-native-screens`
     * or `StatusBar` component from `react-native`, you can ignore it.
     * Defaults to `false`.
     *
     * @see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/14
     * @platform android
     */
    statusBarTranslucent?: boolean;
};
export declare const KeyboardProvider: ({ children, statusBarTranslucent, }: KeyboardProviderProps) => JSX.Element;
export {};
