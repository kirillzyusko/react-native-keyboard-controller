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
    <View style={styles.screen}>
      <TextInput
        placeholder="Type here..."
        placeholderTextColor="#8E8E93"
        style={styles.input}
        testID="over_keyboard_view.input"
      />
      <Button
        color="#007AFF"
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
  screen: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  background: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 34,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 4,
    minHeight: 200,
  },
  input: {
    backgroundColor: "#FFFFFF",
    height: 50,
    alignSelf: "center",
    marginTop: 150,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    width: "85%",
    fontSize: 16,
    color: "#1C1C1E",
  },
});
