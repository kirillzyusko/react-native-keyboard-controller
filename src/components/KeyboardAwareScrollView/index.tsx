// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */

import React, { forwardRef, useCallback, useMemo } from "react";
import { findNodeHandle } from "react-native";
import Reanimated, {
  cancelAnimation,
  interpolate,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withSpring,
  withTiming,
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

export interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  /** Distance between keyboard and focused TextInput. Default: 0 */
  bottomOffset?: number;
  /** Offset for cursor position in large inputs. Positive moves cursor up. Default: -50 */
  cursorPositionOffset?: number;
  /** Prevents automatic scrolling when keyboard hides. Default: false */
  disableScrollOnKeyboardHide?: boolean;
  /** Controls whether this instance should take effect. Default: true */
  enabled?: boolean;
  /** Additional bottom spacing. Default: 0 */
  extraKeyboardSpace?: number;
  /** Custom ScrollView component. Default: Reanimated.ScrollView */
  ScrollViewComponent?: React.ComponentType<ScrollViewProps>;
}
/**
 * A smart ScrollView component that handles keyboard interactions and automatically adjusts
 * content positioning to keep focused inputs visible.
 *
 * @description
 * KeyboardAwareScrollView manages the complexities of keyboard interactions in React Native apps
 * by automatically adjusting scroll position when the keyboard appears/disappears and when inputs
 * receive focus. It handles both single-line and multi-line text inputs, maintaining optimal
 * cursor visibility and smooth animations.
 *
 * Key Features:
 * - Auto-scrolls to keep focused inputs visible
 * - Smooth animations for keyboard transitions
 * - Handles multi-line input expansion
 * - Supports custom bottom offsets and spacing
 * - Configurable keyboard hide behavior
 * - Compatible with custom ScrollView components
 *
 * @props {number} [bottomOffset=0] - Space to maintain between the keyboard and focused input
 * @props {number} [cursorPositionOffset=10] - Vertical offset for cursor position in multi-line inputs
 * @props {boolean} [disableScrollOnKeyboardHide=false] - When true, prevents automatic scrolling when keyboard hides
 * @props {boolean} [enabled=true] - Enables/disables keyboard aware functionality
 * @props {number} [extraKeyboardSpace=0] - Additional padding below keyboard
 * @props {React.ComponentType<ScrollViewProps>} [ScrollViewComponent=Reanimated.ScrollView] - Custom ScrollView implementation
 *
 * @example
 * ```tsx
 * import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
 *
 * function MyForm() {
 *   return (
 *     <KeyboardAwareScrollView>
 *       <TextInput placeholder="Email" />
 *       <TextInput
 *         placeholder="Description"
 *         multiline
 *         style={{ height: 100 }}
 *       />
 *       <TextInput placeholder="Password" />
 *     </KeyboardAwareScrollView>
 *   );
 * }
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
      cursorPositionOffset = 10,
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
    const scrollY = useSharedValue(0);
    const cursorOffset = useSharedValue(0);
    const initialInputY = useSharedValue(0);
    const scrollViewLayout = useSharedValue({ height: 0, y: 0 });
    const scrollGoal = useSharedValue(0);

    const { height } = useWindowDimensions();

    const scrollToPos = (y: number, animated: boolean, spring?: boolean) => {
      "worklet";

      const goal = scrollDistanceWithRespectToSnapPoints(y, snapToOffsets);

      if (scrollGoal.value === goal) {
        return;
      }
      // ignore eslint because https://github.com/facebook/react/issues/29640
      // eslint-disable-next-line react-compiler/react-compiler
      scrollY.value = scrollPosition.value;
      cancelAnimation(scrollY);
      scrollGoal.value = goal;

      if (!animated) {
        scrollGoal.value = goal;
      }
      scrollY.value = spring
        ? withSpring(goal, { damping: 100, stiffness: 100 })
        : withTiming(goal);
    };
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
        scrollViewLayout.value = {
          height: e.nativeEvent.layout.height,
          y: e.nativeEvent.layout.y,
        };
        onLayout?.(e);
      },
      [onLayout],
    );

    const maybeScroll = useCallback(
      (animated: boolean = false, closeKeyboard?: boolean) => {
        "worklet";

        // Check if scrolling is enabled and if the focused input belongs to this scroll view
        if (
          !enabled ||
          layout.value?.parentScrollViewTarget !== scrollViewTarget.value
        ) {
          return 0;
        }

        // Handle keyboard closing by restoring previous scroll position
        if (closeKeyboard) {
          const targetScrollY = scrollBeforeKeyboardMovement.value;

          scrollToPos(targetScrollY, animated, true);

          return targetScrollY - scrollPosition.value;
        }

        const visibleRect =
          scrollViewLayout.value.height - keyboardHeight.value;
        const absoluteY = layout.value?.layout.absoluteY || 0;
        const inputHeight = layout.value?.layout.height || 0;
        const point = absoluteY + inputHeight;

        // Handle case where input is taller than visible area
        if (inputHeight > visibleRect - bottomOffset) {
          const cursorPosition = absoluteY + cursorOffset.value;
          const targetPosition = cursorPosition + cursorPositionOffset;

          // Scroll when keyboard appears or focus changes
          if (keyboardWillAppear.value || tag.value !== -1) {
            const targetScroll = Math.max(
              0,
              scrollPosition.value + (targetPosition - visibleRect),
            );

            scrollToPos(targetScroll, animated, keyboardWillAppear.value);

            return targetScroll - scrollPosition.value;
          }

          // Scroll when cursor position is outside visible area
          if (targetPosition > visibleRect || targetPosition < 0) {
            const targetScroll = Math.max(
              0,
              scrollPosition.value +
                (targetPosition > visibleRect
                  ? targetPosition - visibleRect
                  : targetPosition),
            );

            scrollToPos(targetScroll, animated);

            return targetScroll - scrollPosition.value;
          }

          return 0;
        }

        // Handle case where input is partially hidden by keyboard
        if (visibleRect - point <= bottomOffset) {
          const relativeScrollTo =
            keyboardHeight.value - (height - point) + bottomOffset;
          const targetScrollY = relativeScrollTo + scrollPosition.value;

          scrollToPos(targetScrollY, animated);

          return targetScrollY - scrollPosition.value;
        }

        return 0;
      },
      [bottomOffset, enabled, height, snapToOffsets, cursorPositionOffset],
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

        // Skip if there's no input layout available
        if (!input.value?.layout) {
          return;
        }

        const prevLayout = layout.value;

        layout.value = {
          ...input.value,
          layout: {
            ...input.value.layout,
            height: customHeight ?? input.value.layout.height,
          },
        };
        scrollPosition.value = position.value;
        maybeScroll(true);
        layout.value = prevLayout;
      },
      [maybeScroll],
    );

    const onChangeText = useCallback(() => {
      "worklet";

      // Skip if layout height changed to avoid duplicate handling
      if (layout.value?.layout.height !== input.value?.layout.height) {
        return;
      }

      layout.value = input.value;

      const visibleRect = scrollViewLayout.value.height - keyboardHeight.value;
      const absoluteY = layout.value?.layout.absoluteY || 0;
      const inputHeight = layout.value?.layout.height || 0;
      const point = absoluteY + inputHeight;

      // Scroll if input is taller than visible area or partially hidden
      if (
        inputHeight > visibleRect - bottomOffset ||
        visibleRect - point <= bottomOffset
      ) {
        scrollFromCurrentPosition();
      }
    }, [bottomOffset]);

    const onSelectionChange = useCallback(
      (e: FocusedInputSelectionChangedEvent) => {
        "worklet";

        cursorOffset.value = e.selection.end.y;

        const visibleRect =
          scrollViewLayout.value.height - keyboardHeight.value;
        const inputHeight = layout.value?.layout.height || 0;

        // Scroll if input is taller than visible area
        if (inputHeight > visibleRect - bottomOffset) {
          scrollFromCurrentPosition();
        }
      },
      [cursorOffset, bottomOffset, scrollFromCurrentPosition],
    );

    const onChangeTextHandler = useMemo(
      () => debounce(onChangeText, 100),
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

          syncKeyboardFrame(e);
          const keyboardWillChangeSize =
            keyboardHeight.value !== e.height && e.height > 0;

          keyboardWillAppear.value = e.height > 0 && keyboardHeight.value === 0;

          const keyboardWillHide = e.height === 0;

          const focusWasChanged =
            (tag.value !== e.target && e.target !== -1) ||
            keyboardWillChangeSize;

          // Reset keyboard size and restore scroll position when keyboard hides
          if (keyboardWillHide) {
            initialKeyboardSize.value = 0;

            if (!disableScrollOnKeyboardHide) {
              scrollPosition.value = scrollBeforeKeyboardMovement.value;
              position.value += maybeScroll(true, true);
            }
          }

          // Store scroll position when keyboard appears
          if (keyboardWillAppear.value) {
            scrollBeforeKeyboardMovement.value = position.value;
          }

          // Update scroll position when keyboard size changes or focus changes
          if (
            keyboardWillAppear.value ||
            keyboardWillChangeSize ||
            focusWasChanged
          ) {
            scrollPosition.value = position.value;
            keyboardHeight.value = e.height;
          }

          // Handle initial keyboard appearance
          if (keyboardWillAppear.value) {
            currentKeyboardFrameHeight.value = e.height + extraKeyboardSpace;

            requestAnimationFrame(() => {
              if (focusWasChanged) {
                tag.value = e.target;
                layout.value = input.value;
                initialInputY.value = layout.value?.layout.absoluteY || 0;

                if (e.height > 0) {
                  position.value += maybeScroll(true);
                }
              }
            });
          } else {
            // Handle focus changes without keyboard appearance
            if (focusWasChanged) {
              tag.value = e.target;
              layout.value = input.value;
              initialInputY.value = layout.value?.layout.absoluteY || 0;

              if (e.height > 0) {
                position.value += maybeScroll(true);
              }
            }
          }
        },
        onMove: (e) => {
          "worklet";
          syncKeyboardFrame(e);
          keyboardWillAppear.value = false;
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
        // Handle input height changes while maintaining focus
        if (
          current?.target === previous?.target &&
          current?.layout.height !== previous?.layout.height
        ) {
          const prevLayout = layout.value;

          layout.value = input.value;

          const visibleRect =
            scrollViewLayout.value.height - keyboardHeight.value;

          // Scroll if input is taller than visible area and cursor is out of view
          const absoluteY = layout.value?.layout.absoluteY || 0;
          const visibleBottom = visibleRect - bottomOffset;
          const cursorPosition = absoluteY + cursorOffset.value;

          if (cursorPosition > visibleBottom - bottomOffset) {
            scrollPosition.value += maybeScroll(true);
          }

          layout.value = prevLayout;
        }
      },
      [bottomOffset],
    );

    const view = useAnimatedStyle(
      () => ({
        paddingBottom: enabled ? currentKeyboardFrameHeight.value : 0,
      }),
      [enabled],
    );

    useAnimatedReaction(
      () => scrollY.value,
      (current) => {
        scrollTo(scrollViewAnimatedRef, 0, current, false);
      },
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
