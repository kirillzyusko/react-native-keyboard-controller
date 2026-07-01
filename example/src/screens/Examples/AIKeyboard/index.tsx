import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  KeyboardEffects,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import GlowInput from "./GlowInput";
import KeyboardGradient from "./KeyboardGradient";

/**
 * "AI Keyboard" — an Apple Intelligence / Siri-style keyboard effect (iOS only).
 *
 * A translucent keyboard lets a Skia gradient bleed through as a soft, animated
 * color wash ({@link KeyboardGradient}), while the focused input carries a
 * matching glow ({@link GlowInput}). Both cycle the same warm palette in sync.
 */
const AIKeyboard = () => (
  <View style={styles.container}>
    <SafeAreaView style={styles.hero}>
      <Text style={styles.title}>Describe an image or add a suggestion.</Text>
    </SafeAreaView>
    <KeyboardEffects translucent>
      <KeyboardGradient />
    </KeyboardEffects>
    <KeyboardStickyView offset={{ opened: 16 }} style={styles.sticky}>
      <GlowInput />
    </KeyboardStickyView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 48,
  },
  title: {
    color: "#8E8E93",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  sticky: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default AIKeyboard;
