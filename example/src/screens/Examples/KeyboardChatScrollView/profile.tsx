import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import Avatar from "./components/Avatar";
import { useChatConfigStore } from "./store";
import { MARGIN } from "./styles";

function KeyboardChatScrollViewProfile() {
  const contactName = useChatConfigStore((state) => state.contactName);
  const setContactName = useChatConfigStore((state) => state.setContactName);

  return (
    <KeyboardAwareScrollView
      bottomOffset={MARGIN}
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <Avatar name={contactName} size={96} />
      <TextInput
        autoCorrect={false}
        placeholder="Name"
        placeholderTextColor="#BCBCBC"
        selectionColor="#64D2FF"
        style={styles.input}
        testID="profile.name"
        value={contactName}
        onChangeText={setContactName}
      />
      <Text style={styles.hint}>
        The name and the avatar in the chat header update as you type.
      </Text>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3A3A3C",
  },
  content: {
    alignItems: "center",
    gap: MARGIN,
    padding: MARGIN * 2,
  },
  input: {
    alignSelf: "stretch",
    padding: MARGIN,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#BCBCBC",
    backgroundColor: "#FFFFFF1F",
    color: "#FFFFFF",
    fontSize: 17,
  },
  hint: {
    color: "#BCBCBC",
    textAlign: "center",
  },
});

export default KeyboardChatScrollViewProfile;
