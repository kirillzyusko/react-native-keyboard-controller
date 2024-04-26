import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  findNodeHandle,
} from "react-native";
import { useFocusedInputHandler } from "react-native-keyboard-controller";
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import TextInputMask from "react-native-text-input-mask";

import type {
  TextInputProps,
  TextInputSelectionChangeEventData,
} from "react-native";
import type { TextInputMaskProps } from "react-native-text-input-mask";

type MaskedInputState = {
  formatted: string; // +1 (123) 456-78-90
  extracted?: string; // 1234567890
};

const TextInputWithMicSelection = (props: TextInputProps) => {
  const ref = useRef<TextInput>(null);
  const tag = useSharedValue(-1);
  const position = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    tag.value = findNodeHandle(ref.current) ?? -1;
  }, []);

  useFocusedInputHandler(
    {
      onSelectionChange: (event) => {
        "worklet";

        if (event.target === tag.value) {
          position.value = {
            x: event.selection.end.x,
            y: event.selection.end.y,
          };
        }
      },
    },
    [],
  );

  const style = useAnimatedStyle(
    () => ({
      position: "absolute",
      width: 20,
      height: 20,
      backgroundColor: "blue",
      left: 10,
      transform: [
        {
          translateX: position.value.x,
        },
        {
          translateY: position.value.y,
        },
      ],
    }),
    [],
  );

  return (
    <View>
      <TextInput ref={ref} {...props} />
      <Reanimated.View style={style} />
    </View>
  );
};

export default function TextInputMaskExample() {
  const [data, setData] = useState<MaskedInputState>({
    formatted: "",
    extracted: "",
  });
  const [worklet, setWorkletData] = useState("");
  const [workletSelection, setWorkletSelection] = useState({
    target: -1,
    selection: {
      start: {
        x: 0,
        y: 0,
        position: 0,
      },
      end: {
        x: 0,
        y: 0,
        position: 0,
      },
    },
  });
  const [originalSelection, setOriginalSelection] =
    useState<TextInputSelectionChangeEventData | null>(null);

  useFocusedInputHandler(
    {
      onChangeText: ({ text }) => {
        "worklet";

        runOnJS(setWorkletData)(text);
      },
      onSelectionChange: (event) => {
        "worklet";

        runOnJS(setWorkletSelection)(event);
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
        onSelectionChange={({ nativeEvent }) =>
          setOriginalSelection(nativeEvent)
        }
        keyboardType="phone-pad"
        placeholder="+1 (___) ___ __ __"
        placeholderTextColor="gray"
        style={style.input}
        testID="masked_input"
      />
      <TextInputWithMicSelection
        onSelectionChange={({ nativeEvent }) =>
          setOriginalSelection(nativeEvent)
        }
        onChangeText={onChangeText}
        multiline
        style={style.input}
        testID="multiline_input"
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
      <Text testID="selection_text" style={[style.text, style.bold]}>
        Keyboard controller Selection:
      </Text>
      <Text testID="selection_text_start_end" style={style.text}>
        start: {workletSelection.selection.start.position}, end:{" "}
        {workletSelection.selection.end.position}
      </Text>
      <Text testID="selection_text_target" style={style.text}>
        target:{workletSelection.target}
      </Text>
      <Text testID="selection_text_coordinates_start" style={style.text}>
        startX: {Math.round(workletSelection.selection.start.x)}, startY:{" "}
        {Math.round(workletSelection.selection.start.y)}
      </Text>
      <Text testID="selection_text_coordinates_end" style={style.text}>
        endX: {Math.round(workletSelection.selection.end.x)}, endY:{" "}
        {Math.round(workletSelection.selection.end.y)}
      </Text>
      <Text testID="original_selection_text" style={[style.text, style.bold]}>
        Original selection:
      </Text>
      <Text testID="original_selection_text_start_end" style={style.text}>
        start: {originalSelection?.selection.start}, end:{" "}
        {originalSelection?.selection.end}
      </Text>
      <Text testID="original_selection_text_target" style={style.text}>
        target: {originalSelection?.target}
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
  bold: {
    fontWeight: "bold",
  },
});
