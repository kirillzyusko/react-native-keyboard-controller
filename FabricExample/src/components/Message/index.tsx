import React, { useState } from "react";
import { PixelRatio, Text, View } from "react-native";

import styles from "./styles";

import type { MessageProps } from "./types";

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
          if (nativeEvent.lines.length > 1) {
            const scale = PixelRatio.get();
            const width = Math.max(
              ...nativeEvent.lines.map((line) => line.width),
            );

            setTextWidth(Math.ceil(width * scale) / scale);
          }
        }}
      >
        {text}
      </Text>
    </View>
  );
}
