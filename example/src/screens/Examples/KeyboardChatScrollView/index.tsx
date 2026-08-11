import React, { forwardRef, useCallback, useRef, useState } from "react";
import {
  FlatList,
  type LayoutChangeEvent,
  type ScrollViewProps,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  KeyboardChatScrollView,
  type KeyboardChatScrollViewRef,
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSharedValue, withTiming } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { KeyboardChatScrollViewProps } from "react-native-keyboard-controller";

const MARGIN = 8;
const INPUT_HEIGHT = 42;
const TEXT_INPUT_HEIGHT = INPUT_HEIGHT + MARGIN;

// Wrapper for virtualized lists
const ChatScrollView = forwardRef<
  KeyboardChatScrollViewRef,
  ScrollViewProps & KeyboardChatScrollViewProps
>((props, ref) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardChatScrollView
      ref={ref}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      keyboardDismissMode="interactive"
      offset={bottom - MARGIN}
      {...props}
    />
  );
});

function ChatScreen() {
  const textInputRef = useRef<TextInput>(null);
  const textRef = useRef("");
  const [messages, setMessages] = useState([
    { id: "1786111174702", text: "Hello" },
  ]);
  const { bottom } = useSafeAreaInsets();
  const extraContentPadding = useSharedValue(0);

  const renderScrollComponent = useCallback(
    (props: ScrollViewProps) => (
      <ChatScrollView {...props} extraContentPadding={extraContentPadding} />
    ),
    [extraContentPadding],
  );

  const onSend = useCallback(() => {
    const text = textRef.current.trim();

    if (!text) {
      return;
    }

    setMessages((prev) => [...prev, { id: String(Date.now()), text }]);
    textInputRef.current?.clear();
    textRef.current = "";
  }, []);

  const onInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      extraContentPadding.value = withTiming(
        Math.max(e.nativeEvent.layout.height - INPUT_HEIGHT, 0),
        { duration: 250 },
      );
    },
    [extraContentPadding],
  );

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <KeyboardGestureArea
        interpolator="ios"
        offset={INPUT_HEIGHT}
        style={styles.container}
        textInputNativeID="chat-input"
      >
        <FlatList
          inverted
          contentContainerStyle={{ paddingTop: TEXT_INPUT_HEIGHT }}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Message {...item} />}
          renderScrollComponent={renderScrollComponent}
        />
        <KeyboardStickyView
          offset={{ opened: bottom - MARGIN }}
          style={styles.composer}
        >
          <TextInput
            ref={textInputRef}
            multiline
            nativeID="chat-input"
            placeholder="Type a message..."
            style={styles.input}
            onChangeText={(text) => (textRef.current = text)}
            onLayout={onInputLayout}
          />
          <TouchableOpacity onPress={onSend}>
            <Text>Send</Text>
          </TouchableOpacity>
        </KeyboardStickyView>
      </KeyboardGestureArea>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "#3A3A3C",
  },
  input: {
    flex: 1,
    margin: MARGIN,
    marginBottom: 0,
    padding: MARGIN,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#BCBCBC",
    backgroundColor: "#3A3A3C66",
  },
  composer: {
    position: "absolute",
    width: "100%",
    minHeight: TEXT_INPUT_HEIGHT,
  },
  send: {
    position: "absolute",
    top: MARGIN + (TEXT_INPUT_HEIGHT - MARGIN * 2) / 2,
    right: MARGIN * 2,
    padding: MARGIN,
    backgroundColor: "white",
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 99,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default ChatScreen;
