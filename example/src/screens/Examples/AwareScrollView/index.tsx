import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import TextInput from "../../../components/TextInput";

import { styles } from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<ExamplesStackParamList>;

export default function AwareScrollView({ navigation }: Props) {
  const [disableScrollOnKeyboardHide, setDisableScrollOnKeyboardHide] =
    useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.header}
          onPress={() => setDisableScrollOnKeyboardHide((value) => !value)}
          testID="disable_scroll_on_keyboard_hide"
        >
          {`Back scroll: ${!disableScrollOnKeyboardHide ? "true" : "false"}`}
        </Text>
      ),
    });
  }, [disableScrollOnKeyboardHide]);

  return (
    <KeyboardAwareScrollView
      testID="aware_scroll_view_container"
      bottomOffset={50}
      disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
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
