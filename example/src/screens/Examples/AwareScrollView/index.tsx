import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";
import Switch from "../../../components/Switch";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";
import type { MessageProps } from "../../../components/Message/types";

type Props = StackScreenProps<ExamplesStackParamList>;

export default function AwareScrollView({ navigation }: Props) {
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const [messages, setMessages] = useState<MessageProps[]>([...history]);
  const [text, setText] = useState("");

  const [disableScrollOnKeyboardHide, setDisableScrollOnKeyboardHide] =
    useState(false);
  const [enabled, setEnabled] = useState(true);

  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages((prev) => [{ text: text.trim(), sender: true }, ...prev]);
    setText("");
  };

  const hasText = text.trim().length > 0;

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={s.screen} testID="aware_scroll_view_container">
        {/* Chat header */}
        <View style={s.chatHeader}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>M</Text>
          </View>
          <View style={s.headerInfo}>
            <Text style={s.chatName}>Margelo Team</Text>
            <Text style={s.chatStatus}>online</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          inverted
          data={messages}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <Message text={item.text} sender={item.sender} />
          )}
          style={s.messagesList}
          contentContainerStyle={s.messagesContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />

        {/* Input bar */}
        <View style={s.inputBar}>
          <TouchableOpacity style={s.plusButton}>
            <Text style={s.plusIcon}>+</Text>
          </TouchableOpacity>

          <View style={s.inputWrapper}>
            <RNTextInput
              multiline
              placeholder="iMessage"
              placeholderTextColor="#8E8E93"
              style={s.textInput}
              value={text}
              onChangeText={setText}
            />
          </View>

          <TouchableOpacity
            style={[s.sendButton, !hasText && s.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!hasText}
          >
            <Text style={s.sendArrow}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet ref={bottomSheetModalRef} index={-1} snapPoints={["40%"]}>
        <BottomSheetView style={s.bottomSheetContent}>
          <Button
            testID="bottom_sheet_close_modal"
            title="Close modal"
            onPress={() => bottomSheetModalRef.current?.close()}
          />
          <View style={s.switchContainer}>
            <Text style={s.switchLabel}>Toggle back scroll</Text>
            <Switch
              testID="bottom_sheet_toggle_back_scroll"
              value={disableScrollOnKeyboardHide}
              onChange={() => {
                setDisableScrollOnKeyboardHide(!disableScrollOnKeyboardHide);
              }}
            />
          </View>
          <View style={s.switchContainer}>
            <Text style={s.switchLabel}>Toggle enabled</Text>
            <Switch
              testID="bottom_sheet_toggle_enabled_state"
              value={enabled}
              onChange={() => {
                setEnabled(!enabled);
              }}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  // Header
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 58,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
    gap: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  headerInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  chatStatus: {
    fontSize: 12,
    color: "#34C759",
    marginTop: 1,
  },
  // Messages
  messagesList: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  messagesContent: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 34,
    backgroundColor: "#F9F9F9",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
    gap: 6,
  },
  plusButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "300",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  textInput: {
    minHeight: 32,
    maxHeight: 100,
    fontSize: 16,
    color: "#1A1A2E",
    paddingTop: 6,
    paddingBottom: 6,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#D1D1D6",
  },
  sendArrow: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: -1,
  },
  // Bottom sheet
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
  },
  switchLabel: {
    fontSize: 15,
    color: "#1A1A2E",
  },
});
