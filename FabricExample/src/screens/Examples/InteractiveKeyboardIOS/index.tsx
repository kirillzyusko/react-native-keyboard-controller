import React, { useCallback, useState } from "react";
import { TextInput, View } from "react-native";
import {
  ChatKit,
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles, { TEXT_INPUT_HEIGHT, contentContainerStyle } from "./styles";

import type { LayoutChangeEvent } from "react-native";

function InteractiveKeyboard() {
  const [inputHeight, setInputHeight] = useState(TEXT_INPUT_HEIGHT);
  const [text, setText] = useState("");

  const onInputLayoutChanged = useCallback((e: LayoutChangeEvent) => {
    setInputHeight(e.nativeEvent.layout.height);
  }, []);

  const scrollToBottom = useCallback(() => {
    // animatedRef.current?.scrollToEnd({ animated: false }); // Измени ref
  }, []);

  return (
    <View style={styles.container}>
      <ChatKit.ScrollView
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={contentContainerStyle}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="interactive"
        testID="chat.scroll"
        // onContentSizeChange={scrollToBottom}
      >
        {history.map((message, index) => (
          <Message key={index} {...message} />
        ))}
      </ChatKit.ScrollView>
      <KeyboardStickyView style={styles.composer}>
        <TextInput
          multiline
          nativeID="chat-input"
          style={styles.input}
          testID="chat.input"
          value={text}
          onChangeText={setText}
          onLayout={onInputLayoutChanged}
        />
      </KeyboardStickyView>
    </View>
  );
}

export default InteractiveKeyboard;
