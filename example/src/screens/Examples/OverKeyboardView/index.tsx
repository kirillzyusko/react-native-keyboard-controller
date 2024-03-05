import React, { useEffect, useState } from "react";
import { Modal, TextInput, View } from "react-native";
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
        style={{ backgroundColor: "yellow", width: 200, height: 50, alignSelf: 'center', marginTop: 50 }}
      />
      {isShow && (
        <OverKeyboardView>
          <View
            style={{
              backgroundColor: "yellow",
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
        </OverKeyboardView>
      )}
    </View>
  );
}
