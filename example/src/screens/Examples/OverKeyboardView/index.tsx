import React, { useEffect, useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
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
      {isShow && (
        <OverKeyboardView>
          <View style={{ flex: 1, alignItems: "center" }}>
            <TouchableOpacity onPress={console.log}>
              <View
                style={{
                  backgroundColor: "pink",
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginTop: 700,
                }}
              />
            </TouchableOpacity>
          </View>
        </OverKeyboardView>
      )}
    </View>
  );
}
