import React, { useEffect, useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import {
  KeyboardEvents,
  OverKeyboardView,
} from "react-native-keyboard-controller";

export default function OverKeyboardViewExample() {
  const [isShow, setShow] = useState(false);

  // show
  useEffect(() => {
    const subscription = KeyboardEvents.addListener("keyboardDidShow", (e) => {
      console.log(1, e);
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 5000);
    });

    return subscription.remove;
  }, []);

  // hide
  useEffect(() => {
    const subscription = KeyboardEvents.addListener("keyboardDidHide", (e) => {
      console.log(2, e);
      setShow(false);
    });

    return subscription.remove;
  }, []);

  return (
    <View>
      <TextInput
        style={{
          backgroundColor: "yellow",
          width: 200,
          height: 50,
          alignSelf: "center",
          marginTop: 50,
        }}
      />
      <OverKeyboardView visible={isShow} style={{flex: 1, height: 400, backgroundColor: "green"}}>
        <View style={{flex: 1, height: 400, backgroundColor: "red" }}>
          <View style={{marginTop: 200, marginLeft: 200, width: 200, height: 200, backgroundColor: "blue"}} />
        </View>
      </OverKeyboardView>
    </View>
  );
}
