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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import BlurView from "../../../components/BlurView";

import Message from "./components/Message";
import ConfigSheet from "./config";
import { useChatConfigStore } from "./store";
import styles, { MARGIN, TEXT_INPUT_HEIGHT } from "./styles";
import VirtualizedListScrollView from "./VirtualizedListScrollView";

import type {
  LayoutChangeEvent,
  ScrollView,
  ScrollViewProps,
} from "react-native";

function ChatKitPlayground() {
  const ref = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const textRef = useRef("");
  const [inputHeight, setInputHeight] = useState(TEXT_INPUT_HEIGHT);
  const { inverted, messages, reversedMessages, addMessage, mode, freeze } =
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
    // TODO: we loose ref somewhere
    ref.current?.scrollToEnd({ animated: true });
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
        // textInputNativeID="chat-input"
      >
        {mode === "legend" && (
          <LegendList
            ref={ref}
            data={messages}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={memoList}
          />
        )}
        {mode === "flash" && (
          <FlashList
            ref={ref}
            data={inverted ? reversedMessages : messages}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={VirtualizedListScrollView}
          />
        )}
        {mode === "flat" && (
          <FlatList
            ref={ref}
            data={inverted ? reversedMessages : messages}
            inverted={inverted}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => <Message {...item} />}
            renderScrollComponent={memoList}
          />
        )}
        {mode === "scroll" && (
          <VirtualizedListScrollView ref={ref}>
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

export default ChatKitPlayground;
