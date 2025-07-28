import React, { forwardRef, useCallback, useEffect, useMemo } from "react";
import Reanimated, {
  clamp,
  interpolate,
  runOnUI,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";

import {
  useFocusedInputHandler,
  useReanimatedFocusedInput,
  useWindowDimensions,
} from "../../hooks";
import { findNodeHandle } from "../../utils/findNodeHandle";

import { useSmoothKeyboardHandler } from "./useSmoothKeyboardHandler";
import { debounce, scrollDistanceWithRespectToSnapPoints } from "./utils";

import type {
  LayoutChangeEvent,
  ScrollView,
  ScrollViewProps,
} from "react-native";
import type {
  FocusedInputLayoutChangedEvent,
  FocusedInputSelectionChangedEvent,
  NativeEvent,
} from "react-native-keyboard-controller";

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
  ScrollViewComponent?: React.ComponentType<ScrollViewProps>;
} & ScrollViewProps;

// Everything begins from `onStart` handler. This handler is called every time,
// when keyboard changes its size or when focused `TextInput` was changed. In
// this handler we are calculating/memoizing values which later will be used
// during layout movement. For that we calculate:
// - layout of focused field (`layout`) - to understand whether there will be overlap
// - initial keyboard size (`initialKeyboardSize`) - used in scroll interpolation
// - future keyboard height (`keyboardHeight`) - used in scroll interpolation
// - current scroll position (`scrollPosition`) - used to scroll from this point
//
// Once we've calculated all necessary variables - we can actually start to use them.
// It happens in `onMove` handler - this function simply calls `maybeScroll` with
// current keyboard frame height. This functions makes the smooth transition.
//
// When the transition has finished we go to `onEnd` handler. In this handler
// we verify, that the current field is not overlapped within a keyboard frame.
// For full `onStart`/`onMove`/`onEnd` flow it may look like a redundant thing,
// however there could be some cases, when `onMove` is not called:
// - on iOS when TextInput was changed - keyboard transition is instant
// - on Android when TextInput was changed and keyboard size wasn't changed
// So `onEnd` handler handle the case, when `onMove` wasn't triggered.
//
// ====================================================================================================================+
// -----------------------------------------------------Flow chart-----------------------------------------------------+
// ====================================================================================================================+
//
// +============================+       +============================+        +==================================+
// +  User Press on TextInput   +   =>  +  Keyboard starts showing   +   =>   + As keyboard moves frame by frame +  =>
// +                            +       +       (run `onStart`)      +        +    `onMove` is getting called    +
// +============================+       +============================+        +==================================+
//
// +============================+       +============================+        +=====================================+
// + Keyboard is shown and we   +   =>  +    User moved focus to     +   =>   + Only `onStart`/`onEnd` maybe called +
// +    call `onEnd` handler    +       +     another `TextInput`    +        +    (without involving `onMove`)     +
// +============================+       +============================+        +=====================================+
//

/**
 * A ScrollView component that automatically handles keyboard appearance and disappearance
 * by adjusting its content position to ensure the focused input remains visible.
 *
 * The component uses a sophisticated animation system to smoothly handle keyboard transitions
 * and maintain proper scroll position during keyboard interactions.
 *
 * @returns A ScrollView component that handles keyboard interactions.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view|Documentation} page for more details.
 * @example
 * ```tsx
 * <KeyboardAwareScrollView bottomOffset={20}>
 *   <TextInput placeholder="Enter text" />
 *   <TextInput placeholder="Another input" />
 * </KeyboardAwareScrollView>
 * ```
 */
const KeyboardAwareScrollView = forwardRef<
  ScrollView,
  React.PropsWithChildren<KeyboardAwareScrollViewProps>
>(
  (
    {
      children,
      onLayout,
      bottomOffset = 0,
      disableScrollOnKeyboardHide = false,
      enabled = true,
      extraKeyboardSpace = 0,
      ScrollViewComponent = Reanimated.ScrollView,
      snapToOffsets,
      ...rest
    },
    ref,
  ) => {
    const scrollViewAnimatedRef = useAnimatedRef<Reanimated.ScrollView>();
    const scrollViewTarget = useSharedValue<number | null>(null);
    const scrollPosition = useSharedValue(0);
    const position = useScrollViewOffset(scrollViewAnimatedRef);
    const currentKeyboardFrameHeight = useSharedValue(0);
    const keyboardHeight = useSharedValue(0);
    const keyboardWillAppear = useSharedValue(false);
    const tag = useSharedValue(-1);
    const initialKeyboardSize = useSharedValue(0);
    const scrollBeforeKeyboardMovement = useSharedValue(0);
    const { input } = useReanimatedFocusedInput();
    const layout = useSharedValue<FocusedInputLayoutChangedEvent | null>(null);
    const lastSelection =
      useSharedValue<FocusedInputSelectionChangedEvent | null>(null);

    const { height } = useWindowDimensions();

    const onRef = useCallback((assignedRef: Reanimated.ScrollView) => {
      if (typeof ref === "function") {
        ref(assignedRef);
      } else if (ref) {
        ref.current = assignedRef;
      }

      scrollViewAnimatedRef(assignedRef);
    }, []);
    const onScrollViewLayout = useCallback(
      (e: LayoutChangeEvent) => {
        scrollViewTarget.value = findNodeHandle(scrollViewAnimatedRef.current);

        onLayout?.(e);
      },
      [onLayout],
    );

    /**
     * Function that will scroll a ScrollView as keyboard gets moving.
     */
    const maybeScroll = useCallback(
      (e: number, animated: boolean = false) => {
        "worklet";

        if (!enabled) {
          return 0;
        }

        // input belongs to ScrollView
        if (layout.value?.parentScrollViewTarget !== scrollViewTarget.value) {
          return 0;
        }

        const visibleRect = height - keyboardHeight.value;
        const absoluteY = layout.value?.layout.absoluteY || 0;
        const inputHeight = layout.value?.layout.height || 0;
        const point = absoluteY + inputHeight;

        if (visibleRect - point <= bottomOffset) {
          const relativeScrollTo =
            keyboardHeight.value - (height - point) + bottomOffset;
          const interpolatedScrollTo = interpolate(
            e,
            [initialKeyboardSize.value, keyboardHeight.value],
            [
              0,
              scrollDistanceWithRespectToSnapPoints(
                relativeScrollTo + scrollPosition.value,
                snapToOffsets,
              ) - scrollPosition.value,
            ],
          );
          const targetScrollY =
            Math.max(interpolatedScrollTo, 0) + scrollPosition.value;

          scrollTo(scrollViewAnimatedRef, 0, targetScrollY, animated);

          return interpolatedScrollTo;
        }

        if (point < 0) {
          const positionOnScreen = visibleRect - bottomOffset;
          const topOfScreen = scrollPosition.value + point;

          scrollTo(
            scrollViewAnimatedRef,
            0,
            topOfScreen - positionOnScreen,
            animated,
          );
        }

        return 0;
      },
      [bottomOffset, enabled, height, snapToOffsets],
    );
    const syncKeyboardFrame = useCallback(
      (e: NativeEvent) => {
        "worklet";

        const keyboardFrame = interpolate(
          e.height,
          [0, keyboardHeight.value],
          [0, keyboardHeight.value + extraKeyboardSpace],
        );

        currentKeyboardFrameHeight.value = keyboardFrame;
      },
      [extraKeyboardSpace],
    );

    const updateLayoutFromSelection = useCallback(() => {
      "worklet";

      const customHeight = lastSelection.value?.selection.end.y;

      if (!input.value?.layout || !customHeight) {
        return false;
      }

      layout.value = {
        ...input.value,
        layout: {
          ...input.value.layout,
          // when we have multiline input with limited amount of lines, then custom height can be very big
          // so we clamp it to max input height
          height: clamp(customHeight, 0, input.value.layout.height),
        },
      };

      return true;
    }, [input, lastSelection, layout]);
    const scrollFromCurrentPosition = useCallback(() => {
      "worklet";

      const prevScrollPosition = scrollPosition.value;
      const prevLayout = layout.value;

      if (!updateLayoutFromSelection()) {
        return;
      }

      // eslint-disable-next-line react-compiler/react-compiler
      scrollPosition.value = position.value;
      maybeScroll(keyboardHeight.value, true);
      scrollPosition.value = prevScrollPosition;
      layout.value = prevLayout;
    }, [maybeScroll]);
    const onChangeText = useCallback(() => {
      "worklet";
      scrollFromCurrentPosition();
    }, [scrollFromCurrentPosition]);
    const onChangeTextHandler = useMemo(
      () => debounce(onChangeText, 200),
      [onChangeText],
    );
    const onSelectionChange = useCallback(
      (e: FocusedInputSelectionChangedEvent) => {
        "worklet";

        const lastTarget = lastSelection.value?.target;
        const latestSelection = lastSelection.value?.selection;

        lastSelection.value = e;

        if (e.target !== lastTarget) {
          // ignore this event, because "focus changed" event handled in `useSmoothKeyboardHandler`
          return;
        }
        // caret in the end + end coordinates has been changed -> we moved to a new line
        // so input may grow
        if (
          e.selection.end.position === e.selection.start.position &&
          latestSelection?.end.y !== e.selection.end.y
        ) {
          return scrollFromCurrentPosition();
        }
        // selection has been changed
        if (e.selection.start.position !== e.selection.end.position) {
          return scrollFromCurrentPosition();
        }

        onChangeTextHandler();
      },
      [scrollFromCurrentPosition, onChangeTextHandler],
    );

    useFocusedInputHandler(
      {
        onSelectionChange: onSelectionChange,
      },
      [onSelectionChange],
    );

    useSmoothKeyboardHandler(
      {
        onStart: (e) => {
          "worklet";

          const keyboardWillChangeSize =
            keyboardHeight.value !== e.height && e.height > 0;

          keyboardWillAppear.value = e.height > 0 && keyboardHeight.value === 0;

          const keyboardWillHide = e.height === 0;
          const focusWasChanged =
            (tag.value !== e.target && e.target !== -1) ||
            keyboardWillChangeSize;

          if (keyboardWillChangeSize) {
            initialKeyboardSize.value = keyboardHeight.value;
          }

          if (keyboardWillHide) {
            // on back transition need to interpolate as [0, keyboardHeight]
            initialKeyboardSize.value = 0;
            scrollPosition.value = scrollBeforeKeyboardMovement.value;
          }

          if (
            keyboardWillAppear.value ||
            keyboardWillChangeSize ||
            focusWasChanged
          ) {
            // persist scroll value
            scrollPosition.value = position.value;
            // just persist height - later will be used in interpolation
            keyboardHeight.value = e.height;
          }

          // focus was changed
          if (focusWasChanged) {
            tag.value = e.target;
            // save position of focused text input when keyboard starts to move
            updateLayoutFromSelection();
            // save current scroll position - when keyboard will hide we'll reuse
            // this value to achieve smooth hide effect
            scrollBeforeKeyboardMovement.value = position.value;
          }

          if (focusWasChanged && !keyboardWillAppear.value) {
            // update position on scroll value, so `onEnd` handler
            // will pick up correct values
            position.value += maybeScroll(e.height, true);
          }
        },
        onMove: (e) => {
          "worklet";

          syncKeyboardFrame(e);

          // if the user has set disableScrollOnKeyboardHide, only auto-scroll when the keyboard opens
          if (!disableScrollOnKeyboardHide || keyboardWillAppear.value) {
            maybeScroll(e.height);
          }
        },
        onEnd: (e) => {
          "worklet";

          keyboardHeight.value = e.height;
          scrollPosition.value = position.value;

          syncKeyboardFrame(e);
        },
      },
      [maybeScroll, disableScrollOnKeyboardHide, syncKeyboardFrame],
    );

    useEffect(() => {
      runOnUI(maybeScroll)(keyboardHeight.value, true);
    }, [bottomOffset]);

    useAnimatedReaction(
      () => input.value,
      (current, previous) => {
        if (
          current?.target === previous?.target &&
          current?.layout.height !== previous?.layout.height
        ) {
          // input has changed layout - let's check if we need to scroll
          // may happen when you paste text, then onSelectionChange will be
          // fired earlier than text actually changes its layout
          scrollFromCurrentPosition();
        }
      },
      [],
    );

    const view = useAnimatedStyle(
      () =>
        enabled
          ? {
              // animations become choppy when scrolling to the end of the `ScrollView` (when the last input is focused)
              // this happens because the layout recalculates on every frame. To avoid this we slightly increase padding
              // by `+1`. In this way we assure, that `scrollTo` will never scroll to the end, because it uses interpolation
              // from 0 to `keyboardHeight`, and here our padding is `keyboardHeight + 1`. It allows us not to re-run layout
              // re-calculation on every animation frame and it helps to achieve smooth animation.
              // see: https://github.com/kirillzyusko/react-native-keyboard-controller/pull/342
              paddingBottom: currentKeyboardFrameHeight.value + 1,
            }
          : {},
      [enabled],
    );

    return (
      <ScrollViewComponent
        ref={onRef}
        {...rest}
        scrollEventThrottle={16}
        onLayout={onScrollViewLayout}
      >
        {children}
        {enabled && <Reanimated.View style={view} />}
      </ScrollViewComponent>
    );
  },
);

export default KeyboardAwareScrollView;
