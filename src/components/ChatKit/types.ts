import type { AnimatedScrollViewComponent } from "../ScrollViewWithBottomPadding";
import type { ScrollViewProps } from "react-native";

type KeyboardLiftBehavior = "always" | "whenAtEnd" | "persistent" | "never";

export type ChatKitScrollViewProps = {
  /** Custom component for `ScrollView`. Default is `ScrollView`. */
  ScrollViewComponent: AnimatedScrollViewComponent;
  /** Whether list are using `inverted` prop. Default is `false`. */
  inverted?: boolean;
  /**
   * The distance between the bottom of the screen and the `ScrollView`.
   * When the keyboard appears, the `ScrollView` will only push content by the effective
   * distance (`keyboardHeight - offset`) instead of the full keyboard height.
   *
   * Useful when the input is not at the very bottom of the screen (e.g., above safe area, above
   * bottom tabs, etc. - in this case offset should be equal to the height of the elements between
   * `ScrollView` and bottom of the screen).
   *
   * Default is `0`.
   */
  offset?: number;
  /**
   * Determines how the chat content should behave when the keyboard appears, specifically whether
   * the scroll view should automatically lift its content to keep it visible above the keyboard.
   *
   * Possible values:
   * - `'always'`: The content always lifts along with the keyboard, ensuring the messages from the bottom part of screen
   * remain visible regardless of the current scroll position. This is the default behavior for most chat applications (used in Telegram).
   * - `'whenAtEnd'`: The content lifts only if the scroll view is at the end (i.e., the last message
   * is visible or near the bottom). This prevents unnecessary adjustments when the user is scrolling
   * through older messages (ChatGPT mobile app behavior).
   * - `'persistent'`: The content always lifts when the keyboard appears (similar to `'always'`), but
   * does not reset (lower) when the keyboard hides. This mimics behaviors where the view remains adjusted
   * after keyboard dismissal to maintain focus on the latest content without shifting back (Claude mobile app behavior).
   * - `'never'`: The content does not lift at all when the keyboard appears. Use this for scenarios
   * when you don't want to disturb user attention with animations (Perplexity mobile app behavior).
   *
   * Default is `'always'`.
   */
  keyboardLiftBehavior?: KeyboardLiftBehavior;
  /**
   * When `true`, freezes all keyboard-driven layout changes (padding, content offset, scroll position).
   * Useful when dismissing the keyboard to open a bottom sheet — prevents visual disruption
   * while the sheet is visible.
   *
   * Default is `false`.
   */
  freeze?: boolean;
} & ScrollViewProps;
