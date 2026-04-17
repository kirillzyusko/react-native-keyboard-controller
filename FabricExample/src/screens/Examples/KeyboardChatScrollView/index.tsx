import { LegendList } from "@legendapp/list";
import { FlashList } from "@shopify/flash-list";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BlurView from "../../../components/BlurView";

import Message from "./components/Message";
import ConfigSheet from "./config";
import { useChatConfigStore } from "./store";
import styles, {
  MARGIN,
  TEXT_INPUT_HEIGHT,
  contentContainerStyle,
  invertedContentContainerStyle,
} from "./styles";
import VirtualizedListScrollView, {
  type VirtualizedListScrollViewRef,
} from "./VirtualizedListScrollView";

import type { LayoutChangeEvent, ScrollViewProps } from "react-native";

function KeyboardChatScrollViewPlayground() {
  const chatScrollViewRef = useRef<VirtualizedListScrollViewRef | null>(null);
  const scrollRef = useRef<VirtualizedListScrollViewRef>(null);
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(TEXT_INPUT_HEIGHT);
  const extraContentPadding = useSharedValue(0);
  const { inverted, messages, reversedMessages, addMessage, mode } =
    useChatConfigStore();
  const { bottom } = useSafeAreaInsets();

  const stickyViewOffset = useMemo(
    () => ({ opened: bottom - MARGIN }),
    [bottom],
  );

  const onInputLayoutChanged = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height;

      // eslint-disable-next-line react-compiler/react-compiler
      extraContentPadding.value = Math.max(height - TEXT_INPUT_HEIGHT, 0);
      setInputHeight(height);
    },
    [extraContentPadding],
  );
  const onInput = useCallback((value: string) => {
    setText(value);
  }, []);
  const onSend = useCallback(() => {
    const message = text.trim();

    if (message === "") {
      return;
    }

    addMessage({ text: message, sender: true });
    setText("");
  }, [addMessage, text]);

  useEffect(() => {
    chatScrollViewRef.current?.scrollToEnd({ animated: true });
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const memoList = useCallback(
    (props: ScrollViewProps) => (
      <VirtualizedListScrollView
        {...props}
        chatScrollViewRef={chatScrollViewRef}
        extraContentPadding={extraContentPadding}
      />
    ),
    [extraContentPadding],
  );

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <KeyboardGestureArea
        interpolator="ios"
        offset={inputHeight}
        style={styles.container}
        textInputNativeID="chat-input"
      >
        {mode === "legend" && (
          <LegendList
            alignItemsAtEnd={inverted}
            contentContainerStyle={contentContainerStyle}
            data={messages}
            initialScrollAtEnd={inverted}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={memoList}
          />
        )}
        {mode === "flash" && (
          <FlashList
            contentContainerStyle={
              inverted ? invertedContentContainerStyle : contentContainerStyle
            }
            data={inverted ? reversedMessages : messages}
            inverted={inverted}
            keyExtractor={(item) => item.text}
            maintainVisibleContentPosition={{
              startRenderingFromBottom: inverted,
            }}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={memoList}
          />
        )}
        {mode === "flat" && (
          <FlatList
            data={inverted ? reversedMessages : messages}
            inverted={inverted}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={memoList}
          />
        )}
        {mode === "scroll" && (
          <VirtualizedListScrollView
            ref={scrollRef}
            extraContentPadding={extraContentPadding}
          >
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </VirtualizedListScrollView>
        )}
        <KeyboardStickyView offset={stickyViewOffset} style={styles.composer}>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { overflow: "hidden" },
              styles.input,
            ]}
          >
            <BlurView
              blurAmount={32}
              blurType="light"
              reducedTransparencyFallbackColor="white"
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          <TextInput
            multiline
            nativeID="chat-input"
            style={styles.input}
            testID="chat.input"
            value={text}
            onChangeText={onInput}
            onLayout={onInputLayoutChanged}
          />
          <TouchableOpacity style={styles.send} onPress={onSend}>
            <Image source={require("./send.png")} style={styles.icon} />
          </TouchableOpacity>
        </KeyboardStickyView>
      </KeyboardGestureArea>
      <ConfigSheet />
    </SafeAreaView>
  );
}

export default KeyboardChatScrollViewPlayground;
