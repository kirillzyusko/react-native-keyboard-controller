import React, { useRef } from "react";
import { TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function AwareScrollView() {
  const input1 = useRef<TextInput>(null);
  const input2 = useRef<TextInput>(null);

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerStyle={{ paddingTop: 50 }}
        style={{ paddingHorizontal: 16 }}
        testID="aware_scroll_view_container"
      >
        <TextInput
          ref={input1}
          keyboardType={"default"}
          placeholder={`TextInput#1`}
          returnKeyType="next"
          style={{
            paddingVertical: 10,
            marginVertical: 10,
            borderColor: "black",
            borderWidth: 1,
          }}
          onSubmitEditing={() => input2.current?.focus()}
        />
        <TextInput
          ref={input2}
          keyboardType={"default"}
          placeholder={`TextInput#2}`}
          returnKeyType="next"
          style={{
            paddingVertical: 10,
            marginVertical: 10,
            borderColor: "black",
            borderWidth: 1,
          }}
          onSubmitEditing={() => input1.current?.focus()}
        />
      </KeyboardAwareScrollView>
    </>
  );
}
