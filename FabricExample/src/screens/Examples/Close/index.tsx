import { Button, StyleSheet, TextInput, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";

function CloseScreen() {
  return (
    <View>
      <Button
        testID="close_keyboard_button"
        title="Close keyboard"
        onPress={KeyboardController.dismiss}
      />
      <TextInput
        placeholder="Touch to open the keyboard..."
        placeholderTextColor="#7C7C7C"
        style={styles.input}
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
