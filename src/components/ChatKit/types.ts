import type { AnimatedScrollViewComponent } from "../ScrollViewWithBottomPadding";
import type { ScrollViewProps } from "react-native";

type KeyboardLiftBehavior = "always" | "whenAtEnd";

export type ChatKitScrollViewProps = {
  /** Custom component for `ScrollView`. Default is `ScrollView`. */
  ScrollViewComponent: AnimatedScrollViewComponent;
  /** Whether list are using `inverted` prop. Default is `false`. */
  inverted?: boolean;
  /**
   * Determines how the chat content should behave when the keyboard appears, specifically whether
   * the scroll view should automatically lift its content to keep it visible above the keyboard.
   *
   * Possible values:
   * - `'always'`: The content always lifts along with the keyboard, ensuring the messages from the bottom part of screen
   * remain visible regardless of the current scroll position. This is the default behavior for most chat applications.
   * - `'whenAtEnd'`: The content lifts only if the scroll view is at the end (i.e., the last message
   * is visible or near the bottom). This prevents unnecessary adjustments when the user is scrolling
   * through older messages.
   *
   * Default is `'always'`.
   */
  keyboardLiftBehavior?: KeyboardLiftBehavior;
} & ScrollViewProps;
