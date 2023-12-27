import React from "react";
import { StyleSheet, TextInput as TextInputRN } from "react-native";

import type { TextInputProps } from "react-native";

const TextInput = (props: TextInputProps) => {
  return (
    <TextInputRN
      placeholderTextColor="#6c6c6c"
      style={styles.container}
      multiline
      numberOfLines={10}
      testID={props.placeholder}
      {...props}
      placeholder={`${props.placeholder} (${
        props.keyboardType === "default" ? "text" : "numeric"
      })`}
    />
  );
};

const styles = StyleSheet.create({
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
});

export default TextInput;
