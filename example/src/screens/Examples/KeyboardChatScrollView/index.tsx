import { LegendList, type LegendListRef } from "@legendapp/list";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BlurView from "../../../components/BlurView";

import Message from "./components/Message";
import ConfigSheet from "./config";
import { useChatConfigStore } from "./store";
import styles, { MARGIN, TEXT_INPUT_HEIGHT } from "./styles";
import VirtualizedListScrollView, {
  type VirtualizedListScrollViewRef,
} from "./VirtualizedListScrollView";

import type { MessageProps } from "../../../components/Message/types";
import type { LayoutChangeEvent, ScrollViewProps } from "react-native";

function KeyboardChatScrollViewPlayground() {
  const legendRef = useRef<LegendListRef>(null);
  const flashRef = useRef<FlashList<MessageProps>>(null);
  const flatRef = useRef<FlatList<MessageProps>>(null);
  const scrollRef = useRef<VirtualizedListScrollViewRef>(null);
  const textInputRef = useRef<TextInput>(null);
  const textRef = useRef("");
  const [inputHeight, setInputHeight] = useState(TEXT_INPUT_HEIGHT);
  const { inverted, messages, reversedMessages, addMessage, mode } =
    useChatConfigStore();
  const { bottom } = useSafeAreaInsets();

  const stickyViewOffset = useMemo(
    () => ({ opened: bottom - MARGIN }),
    [bottom],
  );

  const onInputLayoutChanged = useCallback((e: LayoutChangeEvent) => {
    setInputHeight(e.nativeEvent.layout.height);
  }, []);
  const onInput = useCallback((text: string) => {
    textRef.current = text;
  }, []);
  const onSend = useCallback(() => {
    const message = textRef.current.trim();

    if (message === "") {
      return;
    }

    addMessage({ text: message, sender: true });
    textInputRef.current?.clear();
    textRef.current = "";
  }, [addMessage]);

  useEffect(() => {
    legendRef.current?.scrollToOffset({
      animated: true,
      offset: Number.MAX_SAFE_INTEGER,
    });
    flashRef.current?.scrollToEnd({ animated: true });
    flatRef.current?.scrollToOffset({
      animated: true,
      offset: Number.MAX_SAFE_INTEGER,
    });
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const memoList = useCallback(
    (props: ScrollViewProps) => <VirtualizedListScrollView {...props} />,
    [],
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
            ref={legendRef}
            alignItemsAtEnd={inverted}
            data={messages}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={memoList}
          />
        )}
        {mode === "flash" && (
          <FlashList
            ref={flashRef}
            data={inverted ? reversedMessages : messages}
            inverted={inverted}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={VirtualizedListScrollView}
          />
        )}
        {mode === "flat" && (
          <FlatList
            ref={flatRef}
            data={inverted ? reversedMessages : messages}
            inverted={inverted}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={memoList}
          />
        )}
        {mode === "scroll" && (
          <VirtualizedListScrollView ref={scrollRef}>
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
            ref={textInputRef}
            multiline
            nativeID="chat-input"
            style={styles.input}
            testID="chat.input"
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
