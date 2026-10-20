import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  KeyboardController,
  KeyboardProvider,
  KeyboardStickyView,
  useKeyboardState,
} from "react-native-keyboard-controller";

function KeyboardSmokeTest() {
  const visible = useKeyboardState((state) => state.isVisible);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>SwiftPM keyboard smoke test</Text>
      <Text testID="keyboard-state">
        Keyboard {visible ? "visible" : "hidden"}
      </Text>
      <TextInput
        accessibilityLabel="First input"
        placeholder="First input"
        style={styles.input}
        testID="first-input"
      />
      <TextInput
        accessibilityLabel="Second input"
        placeholder="Second input"
        style={styles.input}
        testID="second-input"
      />
      <View style={styles.controls}>
        <Button
          testID="next-input"
          title="Next input"
          onPress={() => KeyboardController.setFocusTo("next")}
        />
        <Button
          testID="dismiss-keyboard"
          title="Dismiss keyboard"
          onPress={() => KeyboardController.dismiss()}
        />
      </View>
      <KeyboardStickyView style={styles.toolbar}>
        <Text>Keyboard toolbar</Text>
      </KeyboardStickyView>
    </View>
  );
}

export default function App() {
  return (
    <KeyboardProvider preload={false}>
      <KeyboardSmokeTest />
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, paddingTop: 96, backgroundColor: "white" },
  title: { fontSize: 22, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#888", padding: 12, marginTop: 16 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    paddingBottom: 24,
  },
});
