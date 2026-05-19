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
  const position0 = useSharedValue({ x: 0, y: 0 });
  const position = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    tag.value = findNodeHandle(ref.current) ?? -1;
  }, []);

  useFocusedInputHandler(
    {
      onSelectionChange: (event) => {
        "worklet";

        if (event.target === tag.value) {
          position0.value = {
            x: event.selection.start.x,
            y: event.selection.start.y,
          };
          position.value = {
            x: event.selection.end.x,
            y: event.selection.end.y,
          };
        }
      },
    },
    [],
  );

  const style0 = useAnimatedStyle(
    () => ({
      position: "absolute",
      width: 100,
      height: 1,
      backgroundColor: "#FF3B30",
      left: 0,
      top: 0,
      transform: [
        {
          translateX: position0.value.x,
        },
        {
          translateY: position0.value.y,
        },
      ],
    }),
    [],
  );

  const style1 = useAnimatedStyle(
    () => ({
      position: "absolute",
      width: 100,
      height: 1,
      backgroundColor: "#007AFF",
      left: 0,
      top: 0,
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

  const style = useAnimatedStyle(
    () => ({
      position: "absolute",
      width: 20,
      height: 20,
      backgroundColor: "#007AFF",
      borderRadius: 10,
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
      <Reanimated.View style={style0} />
      <Reanimated.View style={style1} />
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
        keyboardType="phone-pad"
        mask="+1 ([000]) [000] [00] [00]"
        placeholder="+1 (___) ___ __ __"
        placeholderTextColor="#8E8E93"
        style={[style.input, style.masked]}
        testID="masked_input"
        onChangeText={onChangeText}
        onSelectionChange={({ nativeEvent }) =>
          setOriginalSelection(nativeEvent)
        }
      />
      <TextInputWithMicSelection
        multiline
        style={style.input}
        testID="multiline_input"
        onChangeText={onChangeText}
        onSelectionChange={({ nativeEvent }) =>
          setOriginalSelection(nativeEvent)
        }
      />
      <View style={style.card}>
        <Text style={style.label}>Formatted</Text>
        <Text style={style.text} testID="formatted_text">
          {data.formatted}
        </Text>
        <Text style={style.label}>Extracted</Text>
        <Text style={style.text} testID="extracted_text">
          {data.extracted}
        </Text>
        <Text style={style.label}>Worklet</Text>
        <Text style={style.text} testID="worklet_text">
          {worklet}
        </Text>
      </View>
      <View style={style.card}>
        <Text style={[style.text, style.bold]} testID="selection_text">
          Keyboard controller Selection:
        </Text>
        <Text style={style.label}>Position</Text>
        <Text style={style.text} testID="selection_text_start_end">
          start: {workletSelection.selection.start.position}, end:{" "}
          {workletSelection.selection.end.position}
        </Text>
        <Text style={style.label}>Target</Text>
        <Text style={style.text} testID="selection_text_target">
          {workletSelection.target}
        </Text>
        <Text style={style.label}>Start coordinates</Text>
        <Text style={style.text} testID="selection_text_coordinates_start">
          x: {Math.round(workletSelection.selection.start.x)}, y:{" "}
          {Math.round(workletSelection.selection.start.y)}
        </Text>
        <Text style={style.label}>End coordinates</Text>
        <Text style={style.text} testID="selection_text_coordinates_end">
          x: {Math.round(workletSelection.selection.end.x)}, y:{" "}
          {Math.round(workletSelection.selection.end.y)}
        </Text>
      </View>
      <View style={style.card}>
        <Text style={[style.text, style.bold]} testID="original_selection_text">
          Original selection:
        </Text>
        <Text style={style.label}>Position</Text>
        <Text style={style.text} testID="original_selection_text_start_end">
          start: {originalSelection?.selection.start}, end:{" "}
          {originalSelection?.selection.end}
        </Text>
        <Text style={style.label}>Target</Text>
        <Text style={style.text} testID="original_selection_text_target">
          {originalSelection?.target}
        </Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    height: 100,
    backgroundColor: "#FFFFFF",
    color: "#1C1C1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    paddingHorizontal: 16,
    marginBottom: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  masked: {
    height: 48,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: "#1C1C1E",
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
    color: "#1C1C1E",
    fontSize: 15,
    marginBottom: 6,
    marginTop: 12,
  },
});
