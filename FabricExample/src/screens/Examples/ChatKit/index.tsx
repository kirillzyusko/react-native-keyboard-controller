import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { LegendList } from "@legendapp/list";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ChatKit,
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

import Message from "../../../components/Message";
import Switch from "../../../components/Switch";

import { messages as initial } from "./data";
import styles, { TEXT_INPUT_HEIGHT, contentContainerStyle } from "./styles";

import type { MessageProps } from "../../../components/Message/types";
import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";
import type { LayoutChangeEvent, ScrollView } from "react-native";

type Props = StackScreenProps<ExamplesStackParamList>;

function ChatKitPlayground({ navigation }: Props) {
  const ref = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const textRef = useRef("");
  const [inputHeight, setInputHeight] = useState(TEXT_INPUT_HEIGHT);
  const [inverted, setInverted] = useState(false);
  const [beginning, setBeginning] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>(initial);

  const bottomSheetModalRef = useRef<BottomSheet>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.expand();
  }, []);

  const onInputLayoutChanged = useCallback((e: LayoutChangeEvent) => {
    setInputHeight(e.nativeEvent.layout.height);
  }, []);
  const onInput = useCallback((text: string) => {
    textRef.current = text;
  }, []);
  const onSend = useCallback(() => {
    setMessages((m) => [...m, { text: textRef.current, sender: true }]);
    textInputRef.current?.clear();
    textRef.current = "";
  }, []);

  useEffect(() => {
    ref.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (beginning) {
      setMessages([initial[0]]);
    } else {
      setMessages(initial);
    }
  }, [beginning]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.header}
          testID="open_bottom_sheet_modal"
          onPress={handlePresentModalPress}
        >
          Open config
        </Text>
      ),
    });
  }, [navigation]);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollToEnd({ animated: false });
  }, []);

  return (
    <>
      <View
        offset={inputHeight}
        style={styles.container}
        textInputNativeID="chat-input"
      >
        <LegendList
          maintainScrollAtEnd
          maintainVisibleContentPosition
          data={messages}
          inverted={inverted}
          keyExtractor={(item) => item.text}
          renderItem={({ item }) => <Message {...item} />}
          renderScrollComponent={(props) => (
            <ChatKit.ScrollView
              ref={ref}
              automaticallyAdjustContentInsets={false}
              contentContainerStyle={contentContainerStyle}
              contentInsetAdjustmentBehavior="never"
              inverted={inverted}
              keyboardDismissMode="interactive"
              testID="chat.scroll"
              {...props}
            />
          )}
        />
        {/*<ChatKit.ScrollView
          ref={ref}
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={contentContainerStyle}
          contentInsetAdjustmentBehavior="never"
          keyboardDismissMode="interactive"
          testID="chat.scroll"
        >
          {messages.map((message, index) => (
            <Message key={index} {...message} />
          ))}
        </ChatKit.ScrollView>*/}
        <KeyboardStickyView style={styles.composer}>
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
      <BottomSheet ref={bottomSheetModalRef} index={-1} snapPoints={["40%"]}>
        <BottomSheetView style={styles.bottomSheetContent}>
          <Button
            testID="bottom_sheet_close_modal"
            title="Close modal"
            onPress={() => bottomSheetModalRef.current?.close()}
          />
          <View style={styles.switchContainer}>
            <Text>Toggle inverted</Text>
            <Switch
              testID="bottom_sheet_toggle_inverted_state"
              value={inverted}
              onChange={() => {
                setInverted((i) => !i);
              }}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text>Toggle beginning</Text>
            <Switch
              testID="bottom_sheet_toggle_beginning_state"
              value={beginning}
              onChange={() => {
                setBeginning((b) => !b);
              }}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

export default ChatKitPlayground;
