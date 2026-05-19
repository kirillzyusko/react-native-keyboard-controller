import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput as TextInputRN } from "react-native";

import type { TextInputProps } from "react-native";

type CustomTextInputProps = {
  title?: string;
} & TextInputProps;

const TextInput = (props: CustomTextInputProps) => {
  const { title, ...rest } = props;
  const [focused, setFocused] = useState(false);

  return (
    <>
      {!!title && <Text style={styles.title}>{title}</Text>}
      <TextInputRN
        multiline
        numberOfLines={2}
        placeholderTextColor="#ACACB0"
        style={[
          styles.container,
          focused && styles.focused,
          rest.editable === false && styles.disabled,
        ]}
        testID={rest.placeholder}
        {...rest}
        placeholder={`${rest.placeholder} (${
          rest.keyboardType === "default" ? "text" : "numeric"
        })`}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 6,
    marginLeft: 2,
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
  },
  container: {
    width: "100%",
    minHeight: 50,
    maxHeight: 200,
    marginBottom: 12,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    color: "#1A1A2E",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  focused: {
    borderColor: "#007AFF",
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  disabled: {
    opacity: 0.5,
  },
});

export default TextInput;
