import React from "react";
import TextInputMask from "react-native-text-input-mask";

export default function TextInputMaskExample() {
  return (
    <TextInputMask
      mask="+1 ([000]) [000] [00] [00]"
      onChangeText={(formatted, extracted) => {
        console.log(formatted); // +1 (123) 456-78-90
        console.log(extracted ?? ""); // 1234567890
      }}
      keyboardType="phone-pad"
      placeholder="+1 (___) ___ __ __"
      style={{
        width: "100%",
        backgroundColor: "#e2e8f0",
        borderRadius: 4,
        paddingHorizontal: 12,
      }}
    />
  );
}
