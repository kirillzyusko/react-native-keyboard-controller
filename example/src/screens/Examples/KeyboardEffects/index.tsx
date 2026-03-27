import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardEffects } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
];

const KeyboardEffectsExample = () => {
  const [colorIndex, setColorIndex] = useState(0);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.colorPicker}>
          {COLORS.map((color, index) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                index === colorIndex && styles.selectedColor,
              ]}
              onPress={() => setColorIndex(index)}
            />
          ))}
        </View>
        <TextInput
          placeholder="Tap to open keyboard..."
          style={styles.textInput}
        />
      </SafeAreaView>
      <KeyboardEffects>
        <View
          style={[styles.effect, { backgroundColor: COLORS[colorIndex] }]}
        />
      </KeyboardEffects>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    padding: 16,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#333",
  },
  textInput: {
    height: 50,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  effect: {
    flex: 1,
  },
});

export default KeyboardEffectsExample;
