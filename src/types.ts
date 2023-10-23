import type {
  EmitterSubscription,
  NativeSyntheticEvent,
  ViewProps,
} from 'react-native';

// DirectEventHandler events declaration
export type NativeEvent = {
  progress: number;
  height: number;
  duration: number;
  target: number;
};
export type FocusedInputLayoutChangedEvent = {
  target: number;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    absoluteX: number;
    absoluteY: number;
  };
};
export type EventWithName<T> = {
  eventName: string;
} & T;

// native View/Module declarations
export type KeyboardControllerProps = {
  enabled?: boolean;
  onKeyboardMoveStart?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>
  ) => void;
  onKeyboardMove?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>
  ) => void;
  onKeyboardMoveEnd?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>
  ) => void;
  onKeyboardMoveInteractive?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>
  ) => void;
  onFocusedInputLayoutChanged?: (
    e: NativeSyntheticEvent<EventWithName<FocusedInputLayoutChangedEvent>>
  ) => void;
  // fake props used to activate reanimated bindings
  onKeyboardMoveReanimated?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>
  ) => void;
  onFocusedInputLayoutChangedReanimated?: (
    e: NativeSyntheticEvent<EventWithName<FocusedInputLayoutChangedEvent>>
  ) => void;
  statusBarTranslucent?: boolean;
  navigationBarTranslucent?: boolean;
} & ViewProps;

export type KeyboardGestureAreaProps = {
  interpolator: 'ios' | 'linear';
  /**
   * Whether to allow to show a keyboard from dismissed state by swipe up.
   * Default to `false`.
   */
  showOnSwipeUp?: boolean;
  /**
   * Whether to allow to control a keyboard by gestures. The strategy how
   * it should be controlled is determined by `interpolator` property.
   * Defaults to `true`.
   */
  enableSwipeToDismiss?: boolean;
} & ViewProps;

export type KeyboardControllerModule = {
  // android only
  setDefaultMode: () => void;
  setInputMode: (mode: number) => void;
  // native event module stuff
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
};

// Event module declarations
export type KeyboardControllerEvents =
  | 'keyboardWillShow'
  | 'keyboardDidShow'
  | 'keyboardWillHide'
  | 'keyboardDidHide';
export type KeyboardEventData = {
  height: number;
  duration: number;
  timestamp: number;
  target: number;
};
export type KeyboardEventsModule = {
  addListener: (
    name: KeyboardControllerEvents,
    cb: (e: KeyboardEventData) => void
  ) => EmitterSubscription;
};

// reanimated hook declaration
export type KeyboardHandlerHook<TContext, Event> = (
  handlers: {
    onKeyboardMoveStart?: (e: NativeEvent, context: TContext) => void;
    onKeyboardMove?: (e: NativeEvent, context: TContext) => void;
    onKeyboardMoveEnd?: (e: NativeEvent, context: TContext) => void;
    onKeyboardMoveInteractive?: (e: NativeEvent, context: TContext) => void;
  },
  dependencies?: unknown[]
) => (e: NativeSyntheticEvent<Event>) => void;
export type FocusedInputHandlerHook<TContext, Event> = (
  handlers: {
    onFocusedInputLayoutChanged?: (
      e: FocusedInputLayoutChangedEvent,
      context: TContext
    ) => void;
  },
  dependencies?: unknown[]
) => (e: NativeSyntheticEvent<Event>) => void;

// package types
export type Handlers<T> = Record<string, T | undefined>;
export type KeyboardHandler = Partial<{
  onStart: (e: NativeEvent) => void;
  onMove: (e: NativeEvent) => void;
  onEnd: (e: NativeEvent) => void;
  onInteractive: (e: NativeEvent) => void;
}>;
export type KeyboardHandlers = Handlers<KeyboardHandler>;
