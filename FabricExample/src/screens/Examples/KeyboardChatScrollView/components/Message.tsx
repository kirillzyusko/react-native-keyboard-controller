import React, { useState } from "react";
import { PixelRatio, Platform, StyleSheet, Text, View } from "react-native";

import type { MessageProps } from "../../../../components/Message/types";

/**
 * Fork of original Message component. Created in order not to break existing e2e tests (requires assets re-generation).
 */
export default function Message({ text, sender }: MessageProps) {
  const [textWidth, setTextWidth] = useState<number>();

  return (
    <View style={sender ? styles.senderContainer : styles.recipientContainer}>
      <Text
        style={[
          styles.message,
          textWidth !== undefined && { width: textWidth },
        ]}
        onTextLayout={({ nativeEvent }) => {
          const width = Math.max(
            ...nativeEvent.lines.map((line) => line.width),
          );

          if (Platform.OS === "android") {
            setTextWidth(Math.ceil(width));
          } else if (nativeEvent.lines.length > 1) {
            const scale = PixelRatio.get();

            setTextWidth(Math.ceil(width * scale) / scale);
          }
        }}
      >
        {text}
      </Text>
    </View>
  );
}

const container = {
  borderRadius: 10,
  padding: 10,
  margin: 10,
  marginVertical: 5,
  maxWidth: "80%" as const,
};

const styles = StyleSheet.create({
  senderContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#F8F8FC",
    ...container,
  },
  recipientContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#64D2FF",
    ...container,
  },
  message: {
    alignSelf: "flex-start",
    color: "#000000",
  },
});
