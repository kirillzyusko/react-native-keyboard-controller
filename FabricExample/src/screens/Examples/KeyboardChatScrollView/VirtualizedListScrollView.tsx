import React, { forwardRef, useCallback, useState } from "react";
import {
  type LayoutChangeEvent,
  type ScrollViewProps,
  StyleSheet,
  Text,
} from "react-native";
import { KeyboardChatScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useChatConfigStore } from "./store";
import {
  MARGIN,
  contentContainerStyle,
  invertedContentContainerStyle,
} from "./styles";

import type { RefCallback } from "react";
import type { SharedValue } from "react-native-reanimated";

type VirtualizedListScrollViewProps = ScrollViewProps & {
  extraContentPadding?: SharedValue<number>;
  chatScrollViewRef?: { current: VirtualizedListScrollViewRef | null };
};

export type VirtualizedListScrollViewRef = React.ElementRef<
  typeof KeyboardChatScrollView
>;

const VirtualizedListScrollView = forwardRef<
  VirtualizedListScrollViewRef,
  VirtualizedListScrollViewProps
>(
  (
    {
      onLayout: onLayoutProp,
      extraContentPadding,
      chatScrollViewRef,
      ...props
    },
    ref,
  ) => {
    const setScrollViewRef = useCallback(
      (instance: VirtualizedListScrollViewRef | null) => {
        if (chatScrollViewRef) {
          // eslint-disable-next-line react-compiler/react-compiler
          chatScrollViewRef.current =
            instance as VirtualizedListScrollViewRef | null;
        }
      },
      [chatScrollViewRef],
    );
    const combinedRef: RefCallback<VirtualizedListScrollViewRef> = useCallback(
      (instance) => {
        if (typeof ref === "function") {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }

        setScrollViewRef(instance);
      },
      [ref, setScrollViewRef],
    );
    const [layoutPass, setLayoutPass] = useState(0);
    const { bottom } = useSafeAreaInsets();
    const chatKitOffset = bottom - MARGIN;

    const { inverted, freeze, mode, keyboardLiftBehavior } =
      useChatConfigStore();

    // only FlatList and FlashList supports `inverted` prop
    const isInvertedSupported =
      inverted && (mode === "flat" || mode === "flash") ? inverted : false;
    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        setLayoutPass((l) => l + 1);
        onLayoutProp?.(e);
      },
      [onLayoutProp],
    );

    return (
      <>
        <KeyboardChatScrollView
          ref={combinedRef}
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={
            isInvertedSupported
              ? invertedContentContainerStyle
              : contentContainerStyle
          }
          contentInsetAdjustmentBehavior="never"
          extraContentPadding={extraContentPadding}
          freeze={freeze}
          inverted={isInvertedSupported}
          keyboardDismissMode="interactive"
          keyboardLiftBehavior={keyboardLiftBehavior}
          offset={chatKitOffset}
          testID="chat.scroll"
          onLayout={onLayout}
          {...props}
        />
        <Text style={styles.counter} testID="layout_passes">
          Layout pass: {layoutPass}
        </Text>
      </>
    );
  },
);

const styles = StyleSheet.create({
  counter: {
    position: "absolute",
    color: "white",
    top: 0,
    padding: 12,
    backgroundColor: "#3c3c3c",
  },
});

export default VirtualizedListScrollView;
