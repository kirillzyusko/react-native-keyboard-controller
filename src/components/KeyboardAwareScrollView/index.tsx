import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import Reanimated, {
  clamp,
  interpolate,
  runOnUI,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { KeyboardControllerNative } from "../../bindings";
import {
  useFocusedInputHandler,
  useReanimatedFocusedInput,
  useWindowDimensions,
} from "../../hooks";
import { findNodeHandle } from "../../utils/findNodeHandle";
import useCombinedRef from "../hooks/useCombinedRef";
import useScrollState from "../hooks/useScrollState";
import ScrollViewWithBottomPadding from "../ScrollViewWithBottomPadding";

import { useSmoothKeyboardHandler } from "./useSmoothKeyboardHandler";
import { debounce, scrollDistanceWithRespectToSnapPoints } from "./utils";

import type { LayoutChangeEvent, ScrollView } from "react-native";
import type {
  FocusedInputLayoutChangedEvent,
  FocusedInputSelectionChangedEvent,
  KeyboardAwareScrollViewProps,
  KeyboardAwareScrollViewRef,
  NativeEvent,
} from "react-native-keyboard-controller";

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
  KeyboardAwareScrollViewRef,
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
    const scrollViewRef = React.useRef<ScrollView>(null);
    const onRef = useCombinedRef(scrollViewAnimatedRef, scrollViewRef);
    const scrollViewTarget = useSharedValue<number | null>(null);
    const scrollPosition = useSharedValue(0);
    const {
      offset: position,
      layout: scrollViewLayout,
      size: scrollViewContentSize,
    } = useScrollState(scrollViewAnimatedRef);
    const currentKeyboardFrameHeight = useSharedValue(0);
    const keyboardHeight = useSharedValue(0);
    const keyboardWillAppear = useSharedValue(false);
    const tag = useSharedValue(-1);
    const initialKeyboardSize = useSharedValue(0);
    const scrollBeforeKeyboardMovement = useSharedValue(0);
    const { input, update } = useReanimatedFocusedInput();
    const layout = useSharedValue<FocusedInputLayoutChangedEvent | null>(null);
    const lastSelection =
      useSharedValue<FocusedInputSelectionChangedEvent | null>(null);
    const ghostViewSpace = useSharedValue(-1);
    const pendingSelectionForFocus = useSharedValue(false);
    const selectionUpdatedSinceHide = useSharedValue(false);
    const scrollViewPageY = useSharedValue(0);

    const { height } = useWindowDimensions();

    const onScrollViewLayout = useCallback(
      async (e: LayoutChangeEvent) => {
        const handle = findNodeHandle(scrollViewAnimatedRef.current);

        scrollViewTarget.value = handle;

        onLayout?.(e);

        if (handle !== null) {
          try {
            const { y } = await KeyboardControllerNative.viewPositionInWindow(
              handle,
            );

            scrollViewPageY.value = y;
          } catch {
            // ignore
          }
        }
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

        if (point < scrollViewPageY.value) {
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
    const removeGhostPadding = useCallback((e: number) => {
      "worklet";

      // new `ScrollViewWithBottomPadding` behavior: if we hide keyboard and we are in the end of `ScrollView`
      // then we always need to scroll back, because we apply a padding that doesn't change layout, so we will
      // not have auto scroll back in this case
      if (!keyboardWillAppear.value && ghostViewSpace.value > 0) {
        scrollTo(
          scrollViewAnimatedRef,
          0,
          scrollPosition.value -
            interpolate(
              e,
              [initialKeyboardSize.value, keyboardHeight.value],
              [ghostViewSpace.value, 0],
            ),
          false,
        );

        return true;
      }

      return false;
    }, []);
    const performScrollWithPositionRestoration = useCallback(
      (newPosition: number) => {
        "worklet";

        const prevScroll = scrollPosition.value;

        // eslint-disable-next-line react-compiler/react-compiler
        scrollPosition.value = newPosition;
        maybeScroll(keyboardHeight.value, true);
        scrollPosition.value = prevScroll;
      },
      [scrollPosition, keyboardHeight, maybeScroll],
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

      const prevLayout = layout.value;

      if (!updateLayoutFromSelection()) {
        return;
      }

      performScrollWithPositionRestoration(position.value);

      layout.value = prevLayout;
    }, [performScrollWithPositionRestoration]);
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
        selectionUpdatedSinceHide.value = true;

        if (e.target !== lastTarget || pendingSelectionForFocus.value) {
          if (pendingSelectionForFocus.value) {
            // selection arrived after onStart - complete the deferred setup
            pendingSelectionForFocus.value = false;
            updateLayoutFromSelection();

            // if keyboard was already visible (focus change, no onMove expected),
            // perform the deferred scroll now
            if (!keyboardWillAppear.value && keyboardHeight.value > 0) {
              position.value += maybeScroll(keyboardHeight.value, true);
            }
          }

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
      [
        scrollFromCurrentPosition,
        onChangeTextHandler,
        updateLayoutFromSelection,
        maybeScroll,
      ],
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
            pendingSelectionForFocus.value = false;
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
            // and update keyboard spacer size
            syncKeyboardFrame(e);
          }

          // focus was changed
          if (focusWasChanged) {
            tag.value = e.target;

            if (
              lastSelection.value?.target === e.target &&
              selectionUpdatedSinceHide.value
            ) {
              // fresh selection arrived before onStart - use it to update layout
              updateLayoutFromSelection();
              pendingSelectionForFocus.value = false;
            } else {
              // selection hasn't arrived yet for the new target (iOS 15),
              // or it's stale from previous session (Android refocus same input).
              // Use stale selection as best-effort fallback if available for same target,
              // otherwise fall back to full input layout.
              // Will be corrected if a fresh onSelectionChange arrives.
              if (lastSelection.value?.target === e.target) {
                updateLayoutFromSelection();
              } else if (input.value) {
                layout.value = input.value;
              }
              pendingSelectionForFocus.value = true;
            }

            // save current scroll position - when keyboard will hide we'll reuse
            // this value to achieve smooth hide effect
            scrollBeforeKeyboardMovement.value = position.value;
          }

          if (focusWasChanged && !keyboardWillAppear.value) {
            if (!pendingSelectionForFocus.value) {
              // update position on scroll value, so `onEnd` handler
              // will pick up correct values
              position.value += maybeScroll(e.height, true);
            }
          }

          ghostViewSpace.value =
            position.value +
            scrollViewLayout.value.height -
            scrollViewContentSize.value.height;

          if (ghostViewSpace.value > 0) {
            scrollPosition.value = position.value;
          }
        },
        onMove: (e) => {
          "worklet";

          if (removeGhostPadding(e.height)) {
            return;
          }

          // if the user has set disableScrollOnKeyboardHide, only auto-scroll when the keyboard opens
          if (!disableScrollOnKeyboardHide || keyboardWillAppear.value) {
            maybeScroll(e.height);
          }
        },
        onEnd: (e) => {
          "worklet";

          // if the user has set disableScrollOnKeyboardHide, only auto-scroll when the keyboard opens
          if (!disableScrollOnKeyboardHide || keyboardWillAppear.value) {
            maybeScroll(e.height);
          }

          removeGhostPadding(e.height);

          keyboardHeight.value = e.height;
          scrollPosition.value = position.value;

          if (e.height === 0) {
            selectionUpdatedSinceHide.value = false;
          } else if (keyboardWillAppear.value) {
            // keyboard fully shown after appearing from hidden state — clear
            // pending flag to prevent leaking into next focus-change session.
            // Only when the keyboard was actually appearing (not a focus switch
            // with same keyboard height), otherwise we'd clear the flag before
            // onSelectionChange has a chance to process it.
            pendingSelectionForFocus.value = false;
          }

          syncKeyboardFrame(e);
        },
      },
      [
        maybeScroll,
        removeGhostPadding,
        disableScrollOnKeyboardHide,
        syncKeyboardFrame,
      ],
    );

    const synchronize = useCallback(async () => {
      await update();

      runOnUI(() => {
        "worklet";

        scrollFromCurrentPosition();
      })();
    }, [update, scrollFromCurrentPosition]);

    useImperativeHandle(
      ref,
      () => {
        const scrollView = scrollViewRef.current;

        if (scrollView) {
          const scrollViewWithMethods =
            scrollView as KeyboardAwareScrollViewRef;

          scrollViewWithMethods.assureFocusedInputVisible = () => {
            synchronize();
          };

          return scrollViewWithMethods;
        }

        return {
          assureFocusedInputVisible: () => {
            synchronize();
          },
        } as KeyboardAwareScrollViewRef;
      },
      [synchronize],
    );

    useEffect(() => {
      synchronize();
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

    const padding = useDerivedValue(
      () => (enabled ? currentKeyboardFrameHeight.value : 0),
      [enabled],
    );

    return (
      <ScrollViewWithBottomPadding
        ref={onRef}
        {...rest}
        bottomPadding={padding}
        scrollEventThrottle={16}
        ScrollViewComponent={ScrollViewComponent}
        onLayout={onScrollViewLayout}
      >
        {children}
      </ScrollViewWithBottomPadding>
    );
  },
);

export default KeyboardAwareScrollView;
