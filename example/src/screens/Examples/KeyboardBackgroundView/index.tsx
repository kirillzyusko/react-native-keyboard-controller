import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardBackgroundView,
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

const KeyboardBackdropViewExample = () => {
  const { progress } = useReanimatedKeyboardAnimation();

  const ai = useAnimatedStyle(
    () => ({
      position: "absolute",
      left: 0,
      right: 0,
      flex: 1,
      bottom: 0,
      opacity: progress.value,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <TextInput
        keyboardAppearance="dark"
        keyboardType="default"
        style={styles.textInput}
      />
      <KeyboardStickyView >
        <KeyboardBackgroundView style={{ width: "100%", height: 50 }} />
        <Text style={styles.ai}>AI</Text>
      </KeyboardStickyView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  textInput: {
    height: 50,
    paddingHorizontal: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
  ai: {
    position: "absolute",
    left: 18,
    top: 16,
    color: "white",
  },
});

export default KeyboardBackdropViewExample;
