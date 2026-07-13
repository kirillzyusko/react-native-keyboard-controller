import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CustomKeyboard,
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🤔",
  "😎",
  "🥳",
  "😴",
  "🤯",
  "👍",
  "👎",
  "👏",
  "🙏",
  "💪",
  "🔥",
  "✨",
  "🎉",
  "❤️",
  "💙",
  "💚",
  "💛",
  "🧡",
  "💜",
  "🖤",
  "🤍",
  "🐶",
  "🐱",
  "🦊",
  "🐼",
  "🦄",
  "🐸",
  "🐙",
  "🦋",
];

const FIELD_COUNT = 10;
const FIELDS = Array.from({ length: FIELD_COUNT }, (_, i) => `field_${i + 1}`);

export default function CustomKeyboardExample() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string>(FIELDS[0]);

  const append = (emoji: string) =>
    setValues((prev) => ({
      ...prev,
      [focusedField]: (prev[focusedField] ?? "") + emoji,
    }));
  const backspace = () =>
    setValues((prev) => ({
      ...prev,
      [focusedField]: [...(prev[focusedField] ?? "")].slice(0, -1).join(""),
    }));

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={24}
        contentContainerStyle={styles.content}
        style={styles.container}
      >
        {FIELDS.map((field, index) => (
          <TextInput
            key={field}
            placeholder={`Message ${index + 1} (custom keyboard)`}
            placeholderTextColor="#5c5c5c"
            style={styles.input}
            value={values[field] ?? ""}
            onFocus={() => setFocusedField(field)}
          />
        ))}
      </KeyboardAwareScrollView>
      <CustomKeyboard enabled>
        <View style={styles.keyboard} testID="custom_keyboard.content">
          <View style={styles.emojiGrid}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.emojiKey}
                testID={`emoji_${emoji}`}
                onPress={() => append(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.backspace}
            onPress={backspace}
          >
            <Text style={styles.backspaceText}>⌫</Text>
          </TouchableOpacity>
        </View>
      </CustomKeyboard>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 40,
    flexGrow: 1,
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: "#1c1c1c",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
  },
  keyboard: {
    height: 300,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  emojiKey: {
    width: "12.5%",
    alignItems: "center",
    paddingVertical: 8,
  },
  emoji: {
    fontSize: 28,
  },
  backspace: {
    alignSelf: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  backspaceText: {
    fontSize: 28,
  },
});
