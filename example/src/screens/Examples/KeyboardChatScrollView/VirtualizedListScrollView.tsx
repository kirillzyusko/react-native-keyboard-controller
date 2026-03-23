import React, { forwardRef, useCallback, useRef, useState } from "react";
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

import type { Ref } from "react";
import type { SharedValue } from "react-native-reanimated";

type VirtualizedListScrollViewProps = ScrollViewProps & {
  extraContentPadding?: SharedValue<number>;
  scrollViewRef?: Ref<VirtualizedListScrollViewRef>;
};

export type VirtualizedListScrollViewRef = React.ElementRef<
  typeof KeyboardChatScrollView
>;

const VirtualizedListScrollView = forwardRef<
  VirtualizedListScrollViewRef,
  VirtualizedListScrollViewProps
>(
  (
    { onLayout: onLayoutProp, extraContentPadding, scrollViewRef, ...props },
    ref,
  ) => {
    // combine FlatList's internal ref with the user-provided scrollViewRef
    const scrollViewRefStable = useRef<Ref<VirtualizedListScrollViewRef>>(null);

    scrollViewRefStable.current = scrollViewRef ?? null;
    const combinedRef = useCallback(
      (instance: VirtualizedListScrollViewRef | null) => {
        if (typeof ref === "function") {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }

        const svRef = scrollViewRefStable.current;

        if (typeof svRef === "function") {
          svRef(instance);
        } else if (svRef) {
          svRef.current = instance;
        }
      },
      [ref, scrollViewRefStable],
    );
    const [layoutPass, setLayoutPass] = useState(0);
    const { bottom } = useSafeAreaInsets();
    const chatKitOffset = bottom - MARGIN;

    const { inverted, freeze, mode, keyboardLiftBehavior } =
      useChatConfigStore();

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
          ref={combinedRef}
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
