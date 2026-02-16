import { forwardRef, useMemo } from "react";
import { ChatKit } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useChatConfigStore } from "./store";
import { MARGIN, TEXT_INPUT_HEIGHT } from "./styles";

import type { ScrollViewProps } from "react-native";

const VirtualizedListScrollView = forwardRef((props: ScrollViewProps, ref) => {
  const { bottom } = useSafeAreaInsets();
  const chatKitOffset = bottom - MARGIN;

  const { inverted, freeze, mode } = useChatConfigStore();

  const contentContainerStyle = useMemo(
    () => ({ paddingBottom: TEXT_INPUT_HEIGHT + MARGIN }),
    [],
  );
  const invertedContentContainerStyle = useMemo(
    () => ({ paddingTop: TEXT_INPUT_HEIGHT + MARGIN }),
    [],
  );
  // on new arch only FlatList supports `inverted` prop
  const isInvertedSupported = inverted && mode === "flat" ? inverted : false;

  return (
    <ChatKit.ScrollView
      // TODO: fix types
      ref={ref}
      automaticallyAdjustContentInsets={false}
      contentContainerStyle={
        inverted ? invertedContentContainerStyle : contentContainerStyle
      }
      contentInsetAdjustmentBehavior="never"
      freeze={freeze}
      inverted={isInvertedSupported}
      keyboardDismissMode="interactive"
      offset={chatKitOffset}
      testID="chat.scroll"
      {...props}
    />
  );
});

export default VirtualizedListScrollView;
