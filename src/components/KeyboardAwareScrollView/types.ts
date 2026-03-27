import type { AnimatedScrollViewComponent } from "../ScrollViewWithBottomPadding";
import type { ScrollView, ScrollViewProps } from "react-native";

export type KeyboardAwareScrollViewProps = {
  /** The distance between the keyboard and the caret inside a focused `TextInput` when the keyboard is shown. Default is `0`. */
  bottomOffset?: number;
  /** Prevents automatic scrolling of the `ScrollView` when the keyboard gets hidden, maintaining the current screen position. Default is `false`. */
  disableScrollOnKeyboardHide?: boolean;
  /** Controls whether this `KeyboardAwareScrollView` instance should take effect. Default is `true`. */
  enabled?: boolean;
  /** Adjusting the bottom spacing of KeyboardAwareScrollView. Default is `0`. */
  extraKeyboardSpace?: number;
  /** Custom component for `ScrollView`. Default is `ScrollView`. */
  ScrollViewComponent?: AnimatedScrollViewComponent;
} & ScrollViewProps;
export type KeyboardAwareScrollViewRef = {
  assureFocusedInputVisible: () => void;
} & ScrollView;
