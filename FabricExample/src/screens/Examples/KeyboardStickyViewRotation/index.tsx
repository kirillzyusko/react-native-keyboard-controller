import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  KeyboardController,
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Lifted above a 50pt bar while the keyboard is closed, like a chat composer above a tab bar
const offset = { closed: -50, opened: 0 };
const edges = ["top"] as const;
const dismiss = () => KeyboardController.dismiss();

export default function KeyboardStickyViewRotation() {
  const { height, progress } = useReanimatedKeyboardAnimation();
  const [values, setValues] = useState({ height: 0, progress: 0 });

  useAnimatedReaction(
    () => ({ height: height.value, progress: progress.value }),
    (current) => {
      runOnJS(setValues)(current);
    },
  );

  return (
    <SafeAreaView edges={edges} style={styles.container}>
      <Text style={styles.label} testID="keyboard_values">
        {`height: ${values.height.toFixed(
          0,
        )}\nprogress: ${values.progress.toFixed(2)}`}
      </Text>
      <Text style={styles.hint}>
        Keep the keyboard closed and rotate the device. The input should stay
        above the grey bar.
      </Text>
      <View style={styles.dismiss}>
        <Button
          testID="dismiss_keyboard"
          title="Dismiss keyboard"
          onPress={dismiss}
        />
      </View>
      {/* rendered under the input, so a dropped input stays visible and tappable on top of it */}
      <View style={styles.bar} />
      <KeyboardStickyView offset={offset} style={styles.sticky}>
        <TextInput
          placeholder="Message"
          placeholderTextColor="#8E8E93"
          style={styles.input}
          testID="sticky_input"
        />
      </KeyboardStickyView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  label: {
    position: "absolute",
    top: 80,
    left: 16,
    fontSize: 20,
  },
  hint: {
    position: "absolute",
    top: 150,
    left: 16,
    right: 16,
    color: "#8E8E93",
  },
  dismiss: {
    position: "absolute",
    top: 200,
    left: 16,
  },
  sticky: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  input: {
    height: 50,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#E5E5EA",
  },
  bar: {
    height: 50,
    backgroundColor: "#8E8E93",
  },
});
