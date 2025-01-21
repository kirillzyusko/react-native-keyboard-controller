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
   * A corresponding `nativeID` value from the corresponding `TextInput`.
   */
  textInputNativeID?: string;
} & ViewProps;
export type OverKeyboardViewProps = PropsWithChildren<{
  visible: boolean;
}>;

export type Direction = "next" | "prev" | "current";
export type DismissOptions = {
  keepFocus: boolean;
};
export type KeyboardControllerModule = {
  // android only
  setDefaultMode: () => void;
  setInputMode: (mode: number) => void;
  // all platforms
  dismiss: (options?: DismissOptions) => Promise<void>;
  setFocusTo: (direction: Direction) => void;
  isVisible: () => boolean;
  state: () => KeyboardEventData | null;
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
  height: number;
  duration: number;
  timestamp: number;
  target: number;
  type: NonNullable<TextInputProps["keyboardType"]>;
  appearance: NonNullable<TextInputProps["keyboardAppearance"]>;
};
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
  onStart: (e: NativeEvent) => void;
  onMove: (e: NativeEvent) => void;
  onEnd: (e: NativeEvent) => void;
  onInteractive: (e: NativeEvent) => void;
}>;
export type KeyboardHandlers = Handlers<KeyboardHandler>;
export type FocusedInputHandler = Partial<{
  onChangeText: (e: FocusedInputTextChangedEvent) => void;
  onSelectionChange: (e: FocusedInputSelectionChangedEvent) => void;
}>;
export type FocusedInputHandlers = Handlers<FocusedInputHandler>;
