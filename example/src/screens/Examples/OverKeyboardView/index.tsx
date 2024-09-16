import { BlurView } from "@react-native-community/blur";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
// import { TouchableOpacity } from "react-native-gesture-handler";
import {
  KeyboardEvents,
  OverKeyboardView,
} from "react-native-keyboard-controller";
import { FullWindowOverlay } from "react-native-screens";

export default function OverKeyboardViewExample() {
  const [isShow, setShow] = useState(false);

  return (
    <View>
      <TextInput
        style={{
          backgroundColor: "yellow",
          width: 200,
          height: 50,
          alignSelf: "center",
          marginTop: 150,
        }}
      />
      <Button
        testID="over_keyboard_view.show"
        title="Show"
        onPress={() => setShow(true)}
      />
      <Button
        testID="over_keyboard_view.hide"
        title="Hide"
        onPress={() => setShow(false)}
      />
      <OverKeyboardView visible={isShow}>
        {/*<BlurView
          blurAmount={8}
          blurType="chromeMaterialLight"
          overlayColor="transparent"
          style={StyleSheet.absoluteFill}
        />*/}
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: "red" }}
            onPress={() => setShow(false)}
          >
            <View
              style={{
                width: 200,
                height: 200,
                backgroundColor: "blue",
              }}
            />
          </TouchableOpacity>
        </View>
      </OverKeyboardView>
    </View>
  );
}
