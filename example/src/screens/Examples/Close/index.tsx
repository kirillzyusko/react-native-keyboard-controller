import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardController,
  useResizeMode,
} from "react-native-keyboard-controller";

function ActionButton({
  testID,
  title,
  onPress,
  variant = "default",
}: {
  testID: string;
  title: string;
  onPress: () => void;
  variant?: "default" | "primary";
}) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "primary" && styles.buttonPrimary]}
      testID={testID}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" && styles.buttonTextPrimary,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function CloseScreen() {
  useResizeMode();

  const ref = useRef<TextInput>(null);
  const [keepFocus, setKeepFocus] = useState(false);
  const [animated, setAnimated] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActionButton
          testID="keep_focus_button"
          title={keepFocus ? "Keep focus" : "Don't keep focus"}
          onPress={() => setKeepFocus(!keepFocus)}
        />
        <View style={styles.separator} />
        <ActionButton
          testID="animated_button"
          title={animated ? "Animated" : "Instant"}
          onPress={() => setAnimated(!animated)}
        />
        <View style={styles.separator} />
        <ActionButton
          testID="set_focus_to_current"
          title="KeyboardController.setFocusTo('current')"
          onPress={() => KeyboardController.setFocusTo("current")}
        />
        <View style={styles.separator} />
        <ActionButton
          testID="focus_from_ref"
          title="Focus from ref"
          onPress={() => ref.current?.focus()}
        />
        <View style={styles.separator} />
        <ActionButton
          testID="blur_from_ref"
          title="Blur from ref"
          onPress={() => ref.current?.blur()}
        />
      </View>
      <ActionButton
        testID="close_keyboard_button"
        title="Close keyboard"
        variant="primary"
        onPress={() => KeyboardController.dismiss({ keepFocus, animated })}
      />
      <TextInput
        ref={ref}
        placeholder="Touch to open the keyboard..."
        placeholderTextColor="#AEAEB2"
        style={styles.input}
        testID="input"
        onBlur={() => console.log("blur")}
        onFocus={() => console.log("focus")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  buttonTextPrimary: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginLeft: 16,
  },
  input: {
    height: 48,
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    color: "#1C1C1E",
    fontSize: 16,
  },
});

export default CloseScreen;
