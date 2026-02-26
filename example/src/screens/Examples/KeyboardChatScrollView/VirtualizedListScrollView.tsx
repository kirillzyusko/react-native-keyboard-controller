import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  type LayoutChangeEvent,
  type ScrollViewProps,
  StyleSheet,
  Text,
} from "react-native";
import { KeyboardChatScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useChatConfigStore } from "./store";
import { MARGIN, TEXT_INPUT_HEIGHT } from "./styles";

import type { SharedValue } from "react-native-reanimated";

type VirtualizedListScrollViewProps = ScrollViewProps & {
  extraContentPadding?: SharedValue<number>;
};

export type VirtualizedListScrollViewRef = React.ElementRef<
  typeof KeyboardChatScrollView
>;

const VirtualizedListScrollView = forwardRef<
  VirtualizedListScrollViewRef,
  VirtualizedListScrollViewProps
>(({ onLayout: onLayoutProp, extraContentPadding, ...props }, ref) => {
  const [layoutPass, setLayoutPass] = useState(0);
  const { bottom } = useSafeAreaInsets();
  const chatKitOffset = bottom - MARGIN;

  const { inverted, freeze, mode, keyboardLiftBehavior } = useChatConfigStore();

  const contentContainerStyle = useMemo(
    () => ({ paddingBottom: TEXT_INPUT_HEIGHT + MARGIN }),
    [],
  );
  const invertedContentContainerStyle = useMemo(
    () => ({ paddingTop: TEXT_INPUT_HEIGHT + MARGIN }),
    [],
  );
  // on old arch only FlatList and FlashList supports `inverted` prop
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
        ref={ref}
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={
          inverted ? invertedContentContainerStyle : contentContainerStyle
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
});

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
