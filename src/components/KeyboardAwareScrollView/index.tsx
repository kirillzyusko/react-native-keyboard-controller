import React, { forwardRef, useCallback, useMemo } from "react";
import { findNodeHandle } from "react-native";
import Reanimated, {
  interpolate,
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
  /** The distance between keyboard and focused `TextInput` when keyboard is shown. Default is `0`. */
  bottomOffset?: number;
  /** Prevents automatic scrolling of the `ScrollView` when the keyboard gets hidden, maintaining the current screen position. Default is `false`. */
  disableScrollOnKeyboardHide?: boolean;
  /** Controls whether this `KeyboardAwareScrollView` instance should take effect. Default is `true` */
  enabled?: boolean;
  /** Adjusting the bottom spacing of KeyboardAwareScrollView. Default is `0` */
  extraKeyboardSpace?: number;
  /** Custom component for `ScrollView`. Default is `ScrollView` */
  ScrollViewComponent?: React.ComponentType<ScrollViewProps>;
} & ScrollViewProps;

/*
 * Everything begins from `onStart` handler. This handler is called every time,
 * when keyboard changes its size or when focused `TextInput` was changed. In
 * this handler we are calculating/memoizing values which later will be used
 * during layout movement. For that we calculate:
 * - layout of focused field (`layout`) - to understand whether there will be overlap
 * - initial keyboard size (`initialKeyboardSize`) - used in scroll interpolation
 * - future keyboard height (`keyboardHeight`) - used in scroll interpolation
 * - current scroll position (`scrollPosition`) - used to scroll from this point
 *
 * Once we've calculated all necessary variables - we can actually start to use them.
 * It happens in `onMove` handler - this function simply calls `maybeScroll` with
 * current keyboard frame height. This functions makes the smooth transition.
 *
 * When the transition has finished we go to `onEnd` handler. In this handler
 * we verify, that the current field is not overlapped within a keyboard frame.
 * For full `onStart`/`onMove`/`onEnd` flow it may look like a redundant thing,
 * however there could be some cases, when `onMove` is not called:
 * - on iOS when TextInput was changed - keyboard transition is instant
 * - on Android when TextInput was changed and keyboard size wasn't changed
 * So `onEnd` handler handle the case, when `onMove` wasn't triggered.
 *
 * ====================================================================================================================+
 * -----------------------------------------------------Flow chart-----------------------------------------------------+
 * ====================================================================================================================+
 *
 * +============================+       +============================+        +==================================+
 * +  User Press on TextInput   +   =>  +  Keyboard starts showing   +   =>   + As keyboard moves frame by frame +  =>
 * +                            +       +       (run `onStart`)      +        +    `onMove` is getting called    +
 * +============================+       +============================+        +==================================+
 *
 *
 * +============================+       +============================+        +=====================================+
 * + Keyboard is shown and we   +   =>  +    User moved focus to     +   =>   + Only `onStart`/`onEnd` maybe called +
 * +    call `onEnd` handler    +       +     another `TextInput`    +        +    (without involving `onMove`)     +
 * +============================+       +============================+        +=====================================+
 *
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
     * Function that will scroll a ScrollView as keyboard gets moving
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

        if (absoluteY < 0) {
          const positionOnScreen = visibleRect - inputHeight - bottomOffset;
          const topOfScreen = scrollPosition.value + absoluteY;

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

    const scrollFromCurrentPosition = useCallback(
      (customHeight?: number) => {
        "worklet";

        const prevScrollPosition = scrollPosition.value;
        const prevLayout = layout.value;

        if (!input.value?.layout) {
          return;
        }

        // eslint-disable-next-line react-compiler/react-compiler
        layout.value = {
          ...input.value,
          layout: {
            ...input.value.layout,
            height: customHeight ?? input.value.layout.height,
          },
        };
        scrollPosition.value = position.value;
        maybeScroll(keyboardHeight.value, true);
        scrollPosition.value = prevScrollPosition;
        layout.value = prevLayout;
      },
      [maybeScroll],
    );
    const onChangeText = useCallback(() => {
      "worklet";

      // if typing a text caused layout shift, then we need to ignore this handler
      // because this event will be handled in `useAnimatedReaction` below
      if (layout.value?.layout.height !== input.value?.layout.height) {
        return;
      }

      scrollFromCurrentPosition();
    }, [scrollFromCurrentPosition]);
    const onSelectionChange = useCallback(
      (e: FocusedInputSelectionChangedEvent) => {
        "worklet";

        if (e.selection.start.position !== e.selection.end.position) {
          scrollFromCurrentPosition(e.selection.end.y);
        }
      },
      [scrollFromCurrentPosition],
    );

    const onChangeTextHandler = useMemo(
      () => debounce(onChangeText, 200),
      [onChangeText],
    );

    useFocusedInputHandler(
      {
        onChangeText: onChangeTextHandler,
        onSelectionChange: onSelectionChange,
      },
      [onChangeTextHandler, onSelectionChange],
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
            layout.value = input.value;
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

    useAnimatedReaction(
      () => input.value,
      (current, previous) => {
        if (
          current?.target === previous?.target &&
          current?.layout.height !== previous?.layout.height
        ) {
          const prevLayout = layout.value;

          layout.value = input.value;
          scrollPosition.value += maybeScroll(keyboardHeight.value, true);
          layout.value = prevLayout;
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
        <Reanimated.View style={view} />
      </ScrollViewComponent>
    );
  },
);

export default KeyboardAwareScrollView;
