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
  ChatKit,
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

import type { LayoutChangeEvent, ScrollView } from "react-native";

function ChatKitPlayground() {
  const ref = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const textRef = useRef("");
  const [inputHeight, setInputHeight] = useState(TEXT_INPUT_HEIGHT);
  const { inverted, messages, reversedMessages, addMessage, mode, freeze } =
    useChatConfigStore();
  const { bottom } = useSafeAreaInsets();

  const contentContainerStyle = useMemo(
    () => ({ paddingBottom: TEXT_INPUT_HEIGHT + MARGIN }),
    [],
  );
  const invertedContentContainerStyle = useMemo(
    () => ({ paddingTop: TEXT_INPUT_HEIGHT + MARGIN }),
    [],
  );
  const stickyViewOffset = useMemo(
    () => ({ opened: bottom - MARGIN }),
    [bottom],
  );
  const chatKitOffset = bottom - MARGIN;

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
    ref.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollToEnd({ animated: false });
  }, []);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <View
        offset={inputHeight}
        style={styles.container}
        textInputNativeID="chat-input"
      >
        {mode === "legend" && (
          <LegendList
            data={messages}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={(props) => (
              <ChatKit.ScrollView
                ref={ref}
                automaticallyAdjustContentInsets={false}
                contentContainerStyle={contentContainerStyle}
                contentInsetAdjustmentBehavior="never"
                freeze={freeze}
                keyboardDismissMode="interactive"
                offset={chatKitOffset}
                testID="chat.scroll"
                {...props}
              />
            )}
          />
        )}
        {mode === "flash" && (
          <FlashList
            data={inverted ? reversedMessages : messages}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={(props) => (
              <ChatKit.ScrollView
                ref={ref}
                automaticallyAdjustContentInsets={false}
                contentContainerStyle={
                  inverted
                    ? invertedContentContainerStyle
                    : contentContainerStyle
                }
                contentInsetAdjustmentBehavior="never"
                freeze={freeze}
                keyboardDismissMode="interactive"
                offset={chatKitOffset}
                testID="chat.scroll"
                {...props}
              />
            )}
          />
        )}
        {mode === "flat" && (
          <FlatList
            data={inverted ? reversedMessages : messages}
            inverted={inverted}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={(props) => (
              <ChatKit.ScrollView
                ref={ref}
                automaticallyAdjustContentInsets={false}
                contentContainerStyle={
                  inverted
                    ? invertedContentContainerStyle
                    : contentContainerStyle
                }
                contentInsetAdjustmentBehavior="never"
                freeze={freeze}
                inverted={inverted}
                keyboardDismissMode="interactive"
                offset={chatKitOffset}
                testID="chat.scroll"
                {...props}
              />
            )}
          />
        )}
        {mode === "scroll" && (
          <ChatKit.ScrollView
            ref={ref}
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={contentContainerStyle}
            contentInsetAdjustmentBehavior="never"
            freeze={freeze}
            keyboardDismissMode="interactive"
            offset={chatKitOffset}
            testID="chat.scroll"
          >
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </ChatKit.ScrollView>
        )}
        <KeyboardStickyView
          freeze={freeze}
          offset={stickyViewOffset}
          style={styles.composer}
        >
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
      </View>
      <ConfigSheet />
    </SafeAreaView>
  );
}

export default ChatKitPlayground;
