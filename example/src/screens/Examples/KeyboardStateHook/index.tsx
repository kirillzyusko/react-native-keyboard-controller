import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  useKeyboardState,
  useResizeMode,
} from "react-native-keyboard-controller";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    padding: 16,
  },
  input: {
    height: 50,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1C1C1E",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  lastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: {
    color: "#8E8E93",
    fontSize: 14,
  },
  value: {
    color: "#1C1C1E",
    fontWeight: "600",
    fontSize: 14,
    flexShrink: 1,
    textAlign: "right",
    maxWidth: "60%",
  },
});

export default function UseKeyboardState() {
  useResizeMode();

  const state = useKeyboardState();

  const rows = [
    { label: "isVisible", value: state.isVisible.toString() },
    { label: "height", value: String(state.height) },
    { label: "duration", value: String(state.duration) },
    { label: "timestamp", value: String(state.timestamp) },
    { label: "target", value: String(state.target) },
    { label: "type", value: String(state.type) },
    { label: "appearance", value: String(state.appearance) },
  ];

  return (
    <View style={styles.screen}>
      <TextInput
        keyboardAppearance="dark"
        keyboardType="email-address"
        placeholder="Tap to show keyboard"
        placeholderTextColor="#8E8E93"
        style={styles.input}
      />
      <View style={styles.card}>
        {rows.map((item, index) => (
          <View
            key={item.label}
            style={index < rows.length - 1 ? styles.row : styles.lastRow}
          >
            <Text style={styles.label}>{item.label}</Text>
            <Text numberOfLines={1} style={styles.value}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
