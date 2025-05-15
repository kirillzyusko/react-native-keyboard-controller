import type { PropsWithChildren } from "react";
import type {
  EmitterSubscription,
  NativeSyntheticEvent,
  TextInputProps,
  ViewProps,
} from "react-native";

// DirectEventHandler events declaration
export type NativeEvent = {
  progress: number;
  height: number;
  duration: number;
  target: number;
};
export type FocusedInputLayoutChangedEvent = {
  target: number;
  parentScrollViewTarget: number;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    absoluteX: number;
    absoluteY: number;
  };
};
export type FocusedInputTextChangedEvent = {
  text: string;
};
export type FocusedInputSelectionChangedEvent = {
  target: number;
  selection: {
    start: {
      x: number;
      y: number;
      position: number;
    };
    end: {
      x: number;
      y: number;
      position: number;
    };
  };
};
export type EventWithName<T> = {
  eventName: string;
} & T;

// native View/Module declarations
export type KeyboardControllerProps = {
  //ref prop
  ref?: React.Ref<React.Component<KeyboardControllerProps>>;
  // callback props
  onKeyboardMoveStart?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>,
  ) => void;
  onKeyboardMove?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>,
  ) => void;
  onKeyboardMoveEnd?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>,
  ) => void;
  onKeyboardMoveInteractive?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>,
  ) => void;
  onFocusedInputLayoutChanged?: (
    e: NativeSyntheticEvent<EventWithName<FocusedInputLayoutChangedEvent>>,
  ) => void;
  onFocusedInputTextChanged?: (
    e: NativeSyntheticEvent<EventWithName<FocusedInputTextChangedEvent>>,
  ) => void;
  onFocusedInputSelectionChanged?: (
    e: NativeSyntheticEvent<EventWithName<FocusedInputSelectionChangedEvent>>,
  ) => void;
  // fake props used to activate reanimated bindings
  onKeyboardMoveReanimated?: (
    e: NativeSyntheticEvent<EventWithName<NativeEvent>>,
  ) => void;
  onFocusedInputLayoutChangedReanimated?: (
    e: NativeSyntheticEvent<EventWithName<FocusedInputLayoutChangedEvent>>,
  ) => void;
  onFocusedInputTextChangedReanimated?: (
    e: NativeSyntheticEvent<EventWithName<FocusedInputTextChangedEvent>>,
  ) => void;
  onFocusedInputSelectionChangedReanimated?: (
    e: NativeSyntheticEvent<EventWithName<FocusedInputSelectionChangedEvent>>,
  ) => void;
  // props
  statusBarTranslucent?: boolean;
  navigationBarTranslucent?: boolean;
  preserveEdgeToEdge?: boolean;
  enabled?: boolean;
} & ViewProps;

export type KeyboardGestureAreaProps = {
  /** */
  interpolator?: "ios" | "linear";
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
  /**
   * Extra distance to the keyboard.
   */
  offset?: number;
  /**
   * A corresponding `nativeID` value from the associated `TextInput` (a string that links the `KeyboardGestureArea` to one or more `TextInput` components). This is **required on iOS** in order to apply the `offset` when the keyboard is shown. Only the currently focused `TextInput` with a matching `nativeID` will receive offset behavior. */
  textInputNativeID?: string;
} & ViewProps;
export type OverKeyboardViewProps = PropsWithChildren<{
  /**
   * A boolean prop indicating whether the view is visible or not. If it's true then view is shown on the screen. If it's false then view is hidden.
   */
  visible: boolean;
}>;

export type Direction = "next" | "prev" | "current";
export type DismissOptions = {
  /**
   * A boolean property indicating whether focus should be kept on the input after dismissing the keyboard. Default is `false`.
   */
  keepFocus: boolean;
};
export type KeyboardControllerModule = {
  // android only
  setDefaultMode: () => void;
  setInputMode: (mode: number) => void;
  // all platforms
  /**
   * Dismisses the keyboard.
   *
   * @param options
   * @returns promise that gets resolved when keyboard becomes fully hidden
   */
  dismiss: (options?: DismissOptions) => Promise<void>;
  /**
   * Moves focus to the specified direction (`next`, `prev` or `current` to restore a focus).
   *
   * @param direction to move the focus
   * @returns
   */
  setFocusTo: (direction: Direction) => void;
  /**
   *
   * @returns true if keyboard is currently visible and false otherwise
   */
  isVisible: () => boolean;
  state: () => KeyboardEventData;
};
export type KeyboardControllerNativeModule = {
  // android only
  setDefaultMode: () => void;
  setInputMode: (mode: number) => void;
  // all platforms
  dismiss: (keepFocus: boolean) => void;
  setFocusTo: (direction: Direction) => void;
  // native event module stuff
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
};

// Event module declarations
export type KeyboardControllerEvents =
  | "keyboardWillShow"
  | "keyboardDidShow"
  | "keyboardWillHide"
  | "keyboardDidHide";
export type KeyboardEventData = {
  /** Height of the keyboard */
  height: number;
  /** Duration of the keyboard animation */
  duration: number;
  /** Timestamp of the last keyboard event */
  timestamp: number;
  /** Tag of the focused `TextInput` */
  target: number;
  type: NonNullable<TextInputProps["keyboardType"]>;
  appearance: NonNullable<TextInputProps["keyboardAppearance"]>;
};
export type KeyboardState = {
  isVisible: boolean;
} & KeyboardEventData;
export type KeyboardEventsModule = {
  addListener: (
    name: KeyboardControllerEvents,
    cb: (e: KeyboardEventData) => void,
  ) => EmitterSubscription;
};
export type FocusedInputAvailableEvents = "focusDidSet";
export type FocusedInputEventData = {
  current: number;
  count: number;
};
export type FocusedInputEventsModule = {
  addListener: (
    name: FocusedInputAvailableEvents,
    cb: (e: FocusedInputEventData) => void,
  ) => EmitterSubscription;
};
export type WindowDimensionsAvailableEvents = "windowDidResize";
export type WindowDimensionsEventData = {
  width: number;
  height: number;
};
export type WindowDimensionsEventsModule = {
  addListener: (
    name: WindowDimensionsAvailableEvents,
    cb: (e: WindowDimensionsEventData) => void,
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
  dependencies?: unknown[],
) => (e: NativeSyntheticEvent<Event>) => void;
export type FocusedInputLayoutHandlerHook<TContext, Event> = (
  handlers: {
    onFocusedInputLayoutChanged?: (
      e: FocusedInputLayoutChangedEvent,
      context: TContext,
    ) => void;
  },
  dependencies?: unknown[],
) => (e: NativeSyntheticEvent<Event>) => void;
export type FocusedInputTextHandlerHook<TContext, Event> = (
  handlers: {
    onFocusedInputTextChanged?: (
      e: FocusedInputTextChangedEvent,
      context: TContext,
    ) => void;
  },
  dependencies?: unknown[],
) => (e: NativeSyntheticEvent<Event>) => void;
export type FocusedInputSelectionHandlerHook<TContext, Event> = (
  handlers: {
    onFocusedInputSelectionChanged?: (
      e: FocusedInputSelectionChangedEvent,
      context: TContext,
    ) => void;
  },
  dependencies?: unknown[],
) => (e: NativeSyntheticEvent<Event>) => void;

// package types
export type Handlers<T> = Record<string, T | undefined>;
export type KeyboardHandler = Partial<{
  /** A callback that gets invoked when keyboard starts its movement. The event contains DESTINATION values */
  onStart: (e: NativeEvent) => void;
  /** A callback that gets involved every frame when keyboard changes its position */
  onMove: (e: NativeEvent) => void;
  /** A callback that gets invoked when keyboard finished its movement */
  onEnd: (e: NativeEvent) => void;
  /** A callback that gets invoked every frame when keyboard changes its position due to interactive dismissal */
  onInteractive: (e: NativeEvent) => void;
}>;
export type KeyboardHandlers = Handlers<KeyboardHandler>;
export type FocusedInputHandler = Partial<{
  /** A callback that gets invoked every time when the text changes in focused input */
  onChangeText: (e: FocusedInputTextChangedEvent) => void;
  /** A callback that gets invoked every time when the selection (cursor) coordinates change in focused input */
  onSelectionChange: (e: FocusedInputSelectionChangedEvent) => void;
}>;
export type FocusedInputHandlers = Handlers<FocusedInputHandler>;
