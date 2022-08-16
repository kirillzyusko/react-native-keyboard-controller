import { NativeSyntheticEvent, ViewProps } from 'react-native';
export declare enum AndroidSoftInputModes {
    SOFT_INPUT_ADJUST_NOTHING = 48,
    SOFT_INPUT_ADJUST_PAN = 32,
    SOFT_INPUT_ADJUST_RESIZE = 16,
    SOFT_INPUT_ADJUST_UNSPECIFIED = 0
}
export declare type NativeEvent = {
    progress: number;
    height: number;
};
export declare type EventWithName<T> = {
    eventName: string;
} & T;
export declare type KeyboardControllerProps = {
    onKeyboardMove: (e: NativeSyntheticEvent<EventWithName<NativeEvent>>) => void;
    onKeyboardMoveReanimated: (e: NativeSyntheticEvent<EventWithName<NativeEvent>>) => void;
    statusBarTranslucent?: boolean;
} & ViewProps;
declare type KeyboardController = {
    setDefaultMode: () => void;
    setInputMode: (mode: AndroidSoftInputModes) => void;
};
export declare const KeyboardController: KeyboardController;
declare type KeyboardControllerEvents = 'keyboardWillShow' | 'keyboardDidShow' | 'keyboardWillHide' | 'keyboardDidHide';
declare type KeyboardEvent = {
    height: number;
};
export declare const KeyboardEvents: {
    addListener: (name: KeyboardControllerEvents, cb: (e: KeyboardEvent) => void) => import("react-native").EmitterSubscription;
};
export declare const KeyboardControllerView: import("react-native").HostComponent<KeyboardControllerProps> | (() => never);
export declare const useResizeMode: () => void;
export {};
