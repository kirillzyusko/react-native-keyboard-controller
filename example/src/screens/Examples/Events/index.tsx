import React, { useEffect } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
  KeyboardEvents,
  useResizeMode,
} from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    height: 48,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    paddingHorizontal: 16,
    color: "#1C1C1E",
    fontSize: 16,
  },
});

function EventsListener() {
  useResizeMode();

  useEffect(() => {
    const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {
      const delay = new Date().getTime() - e.timestamp;

      Toast.show({
        type: "info",
        text1: "⬆️ ⌨️ Keyboard will show",
        text2: `📲 Height: ${e.height}, duration: ${e.duration}ms, delay: ${delay}ms, type: ${e.type}`,
      });
    });
    const shown = KeyboardEvents.addListener("keyboardDidShow", (e) => {
      const delay = new Date().getTime() - e.timestamp;

      Toast.show({
        type: "success",
        text1: "⌨️ Keyboard is shown",
        text2: `👋 Height: ${e.height}, duration: ${e.duration}ms, delay: ${delay}ms, type: ${e.type}`,
      });
    });
    const hide = KeyboardEvents.addListener("keyboardWillHide", (e) => {
      const delay = new Date().getTime() - e.timestamp;

      Toast.show({
        type: "info",
        text1: "⬇️ ⌨️ Keyboard will hide",
        text2: `📲 Height: ${e.height}, duration: ${e.duration}ms, delay: ${delay}ms, type: ${e.type}`,
      });
    });
    const hid = KeyboardEvents.addListener("keyboardDidHide", (e) => {
      const delay = new Date().getTime() - e.timestamp;

      Toast.show({
        type: "error",
        text1: "⌨️ Keyboard is hidden",
        text2: `🤐 Height: ${e.height}, duration: ${e.duration}ms, delay: ${delay}ms, type: ${e.type}`,
      });
    });

    return () => {
      show.remove();
      shown.remove();
      hide.remove();
      hid.remove();
    };
  }, []);

  return (
    <TextInput
      keyboardType="numeric"
      style={styles.input}
      placeholder="Tap to see keyboard events"
      placeholderTextColor="#8E8E93"
    />
  );
}

export default function Events() {
  return (
    <View style={styles.container}>
      <EventsListener />
      <Toast />
    </View>
  );
}
