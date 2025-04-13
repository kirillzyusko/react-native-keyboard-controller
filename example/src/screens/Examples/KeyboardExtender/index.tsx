import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardExtender,
  OverKeyboardView,
} from "react-native-keyboard-controller";

// TODO: is not stretched to full width
// TODO: remove _touchHandler when view gets detached from keyboard?
// TODO: don't hardcode height as 44 in native code
// TODO: test how GestureHandler works there

export default function KeyboardExtendExample() {
  const [showExtend, setShowExtend] = useState(false);

  return (
    <View style={styles.container}>
      <Button
        title={showExtend ? "Detach" : "Attach"}
        onPress={() => setShowExtend(!showExtend)}
      />
      <TextInput placeholder="Type something..." style={styles.input} />

      <TextInput placeholder="Another input field..." style={styles.input} />

      <KeyboardExtender enabled={showExtend}>
        <View style={styles.keyboardExtend}>
          <TouchableOpacity>
            <Text style={styles.priceText}>10$</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.priceText}>20$</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.priceText}>50$</Text>
          </TouchableOpacity>
        </View>
      </KeyboardExtender>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  keyboardExtend: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    padding: 15,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
  overKeyboardView: {
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
  },
  hiddenInput: {
    height: 0,
    width: 0,
  },
  helpText: {
    fontSize: 14,
    color: "#666",
  },
});
