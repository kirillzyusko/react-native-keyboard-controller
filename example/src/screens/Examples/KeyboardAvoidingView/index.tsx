import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";
import type { KeyboardAvoidingViewProps } from "react-native";
import type { MessageProps } from "../../../components/Message/types";

type Props = StackScreenProps<ExamplesStackParamList>;

type Behavior = KeyboardAvoidingViewProps["behavior"];
const behaviors: Behavior[] = ["padding", "height", "position"];

export default function KeyboardAvoidingViewExample({ navigation }: Props) {
  const [behavior, setBehavior] = useState<Behavior>(behaviors[0]);
  const [isPackageImplementation, setPackageImplementation] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([...history]);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages((prev) => [{ text: text.trim(), sender: true }, ...prev]);
    setText("");
  };

  const hasText = text.trim().length > 0;

  const Container = RNKeyboardAvoidingView;

  return (
    <KeyboardAvoidingView
      behavior={behavior}
      contentContainerStyle={styles.container}
      style={styles.screen}
      testID="keyboard_avoiding_view.container"
    >
      <View style={styles.content}>
        {/* Chat header */}
        <View style={styles.chatHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.chatName}>Margelo Team</Text>
            <Text style={styles.chatStatus}>online</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          inverted
          data={messages}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <Message text={item.text} sender={item.sender} />
          )}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />

        {/* Input bar */}
        <>
          <View style={styles.inputBar}>
            {/* Attachment */}
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>+</Text>
            </TouchableOpacity>

            {/* Input + send */}
            <View style={styles.inputWrapper}>
              <RNTextInput
                multiline
                placeholder="iMessage"
                placeholderTextColor="#8E8E93"
                style={styles.textInput}
                value={text}
                onChangeText={setText}
                testID="keyboard_avoiding_view.username"
              />
              </View>

            {/* Send */}
            <TouchableOpacity
              style={[styles.sendButton, !hasText && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!hasText}
              testID="keyboard_avoiding_view.submit"
            >
              <Text style={styles.sendArrow}>↑</Text>
            </TouchableOpacity>
          </View>
        </>
      </View>
    </KeyboardAvoidingView>
  );
}
