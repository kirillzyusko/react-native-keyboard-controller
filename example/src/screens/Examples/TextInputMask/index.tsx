import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusedInputHandler } from "react-native-keyboard-controller";
import { runOnJS } from "react-native-reanimated";
import TextInputMask from "react-native-text-input-mask";

import type { TextInputMaskProps } from "react-native-text-input-mask";

type MaskedInputState = {
  formatted: string; // +1 (123) 456-78-90
  extracted?: string; // 1234567890
};

export default function TextInputMaskExample() {
  const [data, setData] = useState<MaskedInputState>({
    formatted: "",
    extracted: "",
  });
  const [worklet, setWorkletData] = useState("");

  useFocusedInputHandler(
    {
      onChangeText: ({ text }) => {
        "worklet";

        runOnJS(setWorkletData)(text);
      },
    },
    [],
  );

  const onChangeText = useCallback<
    NonNullable<TextInputMaskProps["onChangeText"]>
  >((formatted, extracted) => {
    setData({ formatted, extracted });
  }, []);

  return (
    <View style={style.container}>
      <TextInputMask
        mask="+1 ([000]) [000] [00] [00]"
        onChangeText={onChangeText}
        keyboardType="phone-pad"
        placeholder="+1 (___) ___ __ __"
        placeholderTextColor="gray"
        style={style.input}
        testID="masked_input"
      />
      <Text testID="formatted_text" style={style.text}>
        Formatted: {data.formatted}
      </Text>
      <Text testID="extracted_text" style={style.text}>
        Extracted: {data.extracted}
      </Text>
      <Text testID="worklet_text" style={style.text}>
        Worklet: {worklet}
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  input: {
    height: 50,
    backgroundColor: "#dcdcdc",
    color: "black",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    marginVertical: 12,
  },
  text: {
    color: "black",
  },
});
