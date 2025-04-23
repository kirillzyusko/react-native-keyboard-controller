import React, { useState } from "react";
import { StyleSheet, Text, TextInput as TextInputRN } from "react-native";

import type { TextInputProps } from "react-native";

type CustomTextInputProps = {
  title?: string;
} & TextInputProps;

const TextInput = (props: CustomTextInputProps) => {
  const { title, onFocus, ...rest } = props;

  const [focused, setFocused] = useState(false);

  return (
    <>
      {!!title && <Text style={styles.title}>{title}</Text>}
      <TextInputRN
        multiline
        numberOfLines={2}
        placeholderTextColor="#6c6c6c"
        style={[styles.container, rest.editable === false && styles.disabled, focused && styles.focused]}
        testID={rest.placeholder}
        onFocus={() => { setFocused(true); onFocus?.(); }}
        onBlur={() => setFocused(false)}
        {...rest}
        placeholder={null}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 6,
    marginLeft: 3,
    color: "white",
    fontSize: 16,
  },
  container: {
    width: "100%",
    minHeight: 50,
    maxHeight: 200,
    marginBottom: 50,
    borderColor: "#F8F8FC",
    borderWidth: 2,
    marginRight: 160,
    borderRadius: 10,
    color: "black",
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  focused: {
    borderColor: "#00ABFF",
  },
});

export default TextInput;
