import React from "react";
import { StyleSheet, Text, TextInput as TextInputRN } from "react-native";

import type { TextInputProps } from "react-native";

type CustomTextInputProps = {
  title?: string;
} & TextInputProps;

const TextInput = (props: CustomTextInputProps) => {
  const { title, ...rest } = props;

  return (
    <>
      {!!title && <Text style={styles.title}>{title}</Text>}
      <TextInputRN
        placeholderTextColor="#6c6c6c"
        style={[styles.container, rest.editable === false && styles.disabled]}
        multiline
        numberOfLines={2}
        testID={rest.placeholder}
        {...rest}
        placeholder={`${rest.placeholder} (${
          rest.keyboardType === "default" ? "text" : "numeric"
        })`}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 6,
    marginLeft: 3,
    color: "black",
    fontSize: 16,
  },
  container: {
    width: "100%",
    minHeight: 50,
    maxHeight: 200,
    marginBottom: 50,
    borderColor: "black",
    borderWidth: 2,
    marginRight: 160,
    borderRadius: 10,
    color: "black",
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default TextInput;
