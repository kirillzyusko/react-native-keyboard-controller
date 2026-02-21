import type { SharedValue } from "react-native-reanimated";

type KeyboardLiftBehavior = "always" | "whenAtEnd" | "persistent" | "never";

type UseChatKeyboardOptions = {
  inverted: boolean;
  keyboardLiftBehavior: KeyboardLiftBehavior;
  freeze: boolean;
  offset: number;
};

type UseChatKeyboardReturn = {
  /** Extra scrollable space (= keyboard height). Used as contentInset on iOS, contentInsetBottom/contentInsetTop on Android. */
  padding: SharedValue<number>;
  /** Absolute Y content offset for iOS (set once in onStart). `undefined` on Android. */
  contentOffsetY: SharedValue<number> | undefined;
};

export type {
  KeyboardLiftBehavior,
  UseChatKeyboardOptions,
  UseChatKeyboardReturn,
};
