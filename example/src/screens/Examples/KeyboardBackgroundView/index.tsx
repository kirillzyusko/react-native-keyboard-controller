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
      opacity: progress.value,
      right: 20,
      bottom: 20,
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
      <Reanimated.View style={ai}>
        <KeyboardStickyView>
          <TouchableOpacity onPress={() => Alert.alert("Your AI assistant")}>
            <KeyboardBackgroundView
              style={{ width: 50, height: 50, borderRadius: 26 }}
            />
            <Text style={styles.ai}>AI</Text>
          </TouchableOpacity>
        </KeyboardStickyView>
      </Reanimated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
