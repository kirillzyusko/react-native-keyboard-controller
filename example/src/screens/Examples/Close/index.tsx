import { Button, StyleSheet, TextInput, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";

function CloseScreen() {
  return (
    <View>
      <Button
        title="Close keyboard"
        onPress={() => KeyboardController.dismiss()}
        testID="close_keyboard_button"
      />
      <TextInput style={styles.input} placeholder="Touch to open the keyboard..." placeholderTextColor="#7C7C7C" />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: "84%",
    borderWidth: 2,
    borderColor: "#3C3C3C",
    borderRadius: 8,
    alignSelf: 'center',
    paddingHorizontal: 8,
    marginTop: 16,
  },
});

export default CloseScreen;