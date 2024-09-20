// import { BlurView } from "@react-native-community/blur";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { OverKeyboardView } from "react-native-keyboard-controller";

export default function OverKeyboardViewExample() {
  const [isShow, setShow] = useState(false);

  return (
    <View>
      <TextInput style={styles.input} testID="over_keyboard_view.input" />
      <Button
        testID="over_keyboard_view.show"
        title="Show"
        onPress={() => setShow(true)}
      />
      <OverKeyboardView visible={isShow}>
        {/*<BlurView
          blurAmount={8}
          blurType="light"
          overlayColor="transparent"
          style={StyleSheet.absoluteFill}
        />*/}
        <GestureHandlerRootView style={styles.fullScreen}>
          <TouchableWithoutFeedback
            style={styles.fullScreen}
            testID="over_keyboard_view.background"
            onPress={() => setShow(false)}
          >
            <View style={styles.container}>
              <TouchableOpacity
                testID="over_keyboard_view.content"
                onPress={() => setShow(false)}
              >
                <View style={styles.background} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </GestureHandlerRootView>
      </OverKeyboardView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  background: {
    width: 200,
    height: 200,
    backgroundColor: "blue",
  },
  input: {
    backgroundColor: "yellow",
    width: 200,
    height: 50,
    alignSelf: "center",
    marginTop: 150,
  },
});
