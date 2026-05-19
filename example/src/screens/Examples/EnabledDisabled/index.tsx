import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useKeyboardController } from "react-native-keyboard-controller";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";

export default function EnabledDisabled() {
  const { enabled, setEnabled } = useKeyboardController();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Keyboard Handling</Text>
            <Text style={styles.sublabel}>
              {enabled ? "Currently enabled" : "Currently disabled"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, enabled && styles.toggleActive]}
            testID="toggle_button"
            onPress={() => setEnabled(!enabled)}
          >
            <Text
              style={[
                styles.toggleText,
                enabled && styles.toggleTextActive,
              ]}
            >
              {enabled ? "Enabled" : "Disabled"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAnimationTemplate />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingTop: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  sublabel: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  toggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  toggleActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
});
