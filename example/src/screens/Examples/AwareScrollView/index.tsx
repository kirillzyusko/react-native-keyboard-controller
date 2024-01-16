import React, { useState } from "react";
import { Button } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import TextInput from "../../../components/TextInput";

import { styles } from "./styles";

export default function AwareScrollView() {
  const [disableScrollOnKeyboardHide, setDisableScrollOnKeyboardHide] =
    useState(false);
  return (
    <KeyboardAwareScrollView
      testID="aware_scroll_view_container"
      bottomOffset={50}
      disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Button
        title={`Set Disable Scroll on Close to: ${
          disableScrollOnKeyboardHide ? "Off" : "On"
        }`}
        onPress={() =>
          setDisableScrollOnKeyboardHide(!disableScrollOnKeyboardHide)
        }
      />
      {new Array(10).fill(0).map((_, i) => (
        <TextInput
          key={i}
          placeholder={`TextInput#${i}`}
          keyboardType={i % 2 === 0 ? "numeric" : "default"}
        />
      ))}
    </KeyboardAwareScrollView>
  );
}
