import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import {
  useKeyboardState,
  useResizeMode,
} from "react-native-keyboard-controller";

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: "100%",
    backgroundColor: "#3c3c3c",
  },
  text: {
    color: "black",
  },
});

export default function UseKeyboardState() {
  useResizeMode();

  const state = useKeyboardState();

  return (
    <>
      <TextInput
        keyboardAppearance="dark"
        keyboardType="email-address"
        style={styles.input}
      />
      <Text style={styles.text}>isVisible: {state.isVisible.toString()}</Text>
      <Text style={styles.text}>height: {state.height}</Text>
      <Text style={styles.text}>duration: {state.duration}</Text>
      <Text style={styles.text}>timestamp: {state.timestamp}</Text>
      <Text style={styles.text}>target: {state.target.toString()}</Text>
      <Text style={styles.text}>type: {state.type}</Text>
      <Text style={styles.text}>appearance: {state.appearance}</Text>
    </>
  );
}
