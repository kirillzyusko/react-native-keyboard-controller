import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import {
  KeyboardEvents,
  useResizeMode,
} from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: "100%",
    backgroundColor: "#3c3c3c",
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
        text2: `📲 Height: ${e.height}, duration: ${e.duration}ms, delay: ${delay}ms`,
      });
    });
    const shown = KeyboardEvents.addListener("keyboardDidShow", (e) => {
      const delay = new Date().getTime() - e.timestamp;
      Toast.show({
        type: "success",
        text1: "⌨️ Keyboard is shown",
        text2: `👋 Height: ${e.height}, duration: ${e.duration}ms, delay: ${delay}ms`,
      });
    });
    const hide = KeyboardEvents.addListener("keyboardWillHide", (e) => {
      const delay = new Date().getTime() - e.timestamp;
      Toast.show({
        type: "info",
        text1: "⬇️ ⌨️ Keyboard will hide",
        text2: `📲 Height: ${e.height}, duration: ${e.duration}ms, delay: ${delay}ms`,
      });
    });
    const hid = KeyboardEvents.addListener("keyboardDidHide", (e) => {
      const delay = new Date().getTime() - e.timestamp;
      Toast.show({
        type: "error",
        text1: "⌨️ Keyboard is hidden",
        text2: `🤐 Height: ${e.height}, duration: ${e.duration}ms, delay: ${delay}ms`,
      });
    });

    return () => {
      show.remove();
      shown.remove();
      hide.remove();
      hid.remove();
    };
  }, []);

  return <TextInput style={styles.input} />;
}

export default function Events() {
  return (
    <>
      <EventsListener />
      <Toast />
    </>
  );
}
