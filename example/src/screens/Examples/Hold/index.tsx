import { useState } from "react";
import { Button, StatusBar, Text, TextInput, View } from "react-native";
import {
  KeyboardAvoidingView,
  useKeyboardContext,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HoldScreen() {
  const [isNumberFieldDisplayed, setIsNumberFieldDisplayed] = useState(true);
  const {retain} = useKeyboardContext();

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={100}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1}}>
          <View style={{ flex: 1 }}>
            <Text>Welcome!</Text>
            <View style={{ flex: 1, backgroundColor: "red" }}>
              <Button
                title="Change focus"
                onPress={async () => {
                  await retain();
                  setIsNumberFieldDisplayed((prevValue) => !prevValue);
                }}
              />
              {!isNumberFieldDisplayed && (
                <TextInput
                  autoFocus
                  placeholder="Type something here"
                  placeholderTextColor="black"
                />
              )}
              {isNumberFieldDisplayed && (
                <TextInput
                  autoFocus
                  keyboardType="number-pad"
                  placeholder="Type a number here"
                  placeholderTextColor="black"
                />
              )}
              <View style={{ marginTop: "auto" }}>
                <Button title="Footer button" onPress={() => {}} />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
