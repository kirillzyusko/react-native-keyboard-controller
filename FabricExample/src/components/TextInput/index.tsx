import React, { useState } from "react";
import {
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TextInput as TextInputRN,
} from "react-native";

import type { TextInputProps } from "react-native";

type CustomTextInputProps = {
  title?: string;
} & TextInputProps;

const TextInput = (props: CustomTextInputProps) => {
  const { title, ...rest } = props;
  const [contentHeight, setContentHeight] = useState<number>();
  const autoGrow = rest.style === undefined;

  return (
    <>
      {!!title && <Text style={styles.title}>{title}</Text>}
      <TextInputRN
        multiline
        numberOfLines={Platform.OS === "android" ? 2 : undefined}
        placeholderTextColor="#6c6c6c"
        testID={props.placeholder}
        {...rest}
        placeholder={`${props.placeholder} (${
          props.keyboardType === "default" ? "text" : "numeric"
        })`}
        style={[
          rest.style ?? [
            styles.container,
            rest.editable === false && styles.disabled,
          ],
          autoGrow && contentHeight !== undefined && { height: contentHeight },
        ]}
        onContentSizeChange={(event) => {
          if (autoGrow && Platform.OS === "android") {
            // Paper measures its borders outside the native text padding.
            setContentHeight(event.nativeEvent.contentSize.height + 4);
          }
          rest.onContentSizeChange?.(event);
        }}
      />
      {Platform.OS === "ios" && autoGrow && typeof rest.value === "string" && (
        <Text
          accessible={false}
          pointerEvents="none"
          style={styles.measurement}
          onTextLayout={({ nativeEvent }) => {
            const textHeight = nativeEvent.lines.reduce(
              (height, line) => height + line.height,
              0,
            );
            const scale = PixelRatio.get();

            // Five points of native top padding plus the two-point borders.
            setContentHeight(Math.ceil(textHeight * scale) / scale + 9);
          }}
        >
          {rest.value.endsWith("\n") ? `${rest.value}I` : rest.value || "I"}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  measurement: {
    position: "absolute",
    opacity: 0,
    width: "100%",
    fontSize: 14,
    paddingHorizontal: 14,
    maxHeight: 200,
  },
  title: {
    marginBottom: 6,
    marginLeft: 3,
    color: "black",
    fontSize: 16,
  },
  container: {
    width: "100%",
    // Paper reserves two lines on Android; Fabric measures only the current text.
    minHeight:
      Platform.OS === "android"
        ? PixelRatio.roundToNearestPixel(56.75) + 4
        : 50,
    maxHeight: 200,
    marginBottom: 50,
    borderColor: "black",
    borderWidth: 2,
    marginRight: 160,
    borderRadius: 10,
    color: "black",
    paddingHorizontal: Platform.OS === "android" ? 10 : 12,
    ...Platform.select({ android: { paddingTop: 8, paddingBottom: 9.1 } }),
  },
  disabled: {
    opacity: 0.5,
  },
});

export default TextInput;
