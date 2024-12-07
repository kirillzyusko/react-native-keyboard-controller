import { useRef, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";

function CloseScreen() {
  const ref = useRef<TextInput>(null);
  const [keepFocus, setKeepFocus] = useState(false);

  return (
    <View>
      <Button
        testID="keep_focus_button"
        title={keepFocus ? "Keep focus" : "Don't keep focus"}
        onPress={() => setKeepFocus(!keepFocus)}
      />
      <Button
        testID="set_focus_to_current"
        title="KeyboardController.setFocusTo('current')"
        onPress={() => KeyboardController.setFocusTo("current")}
      />
      <Button
        testID="focus_from_ref"
        title="Focus from ref"
        onPress={() => ref.current?.focus()}
      />
      <Button
        testID="blur_from_ref"
        title="Blur from ref"
        onPress={() => ref.current?.blur()}
      />
      <Button
        testID="close_keyboard_button"
        title="Close keyboard"
        onPress={() => KeyboardController.dismiss({ keepFocus })}
      />
      <TextInput
        ref={ref}
        placeholder="Touch to open the keyboard..."
        placeholderTextColor="#7C7C7C"
        style={styles.input}
        testID="input"
        onBlur={() => console.log("blur")}
        onFocus={() => console.log("focus")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: "84%",
    borderWidth: 2,
    borderColor: "#3C3C3C",
    borderRadius: 8,
    alignSelf: "center",
    paddingHorizontal: 8,
    marginTop: 16,
  },
});

export default CloseScreen;
