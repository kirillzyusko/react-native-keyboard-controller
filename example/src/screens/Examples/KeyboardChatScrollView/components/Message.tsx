import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { MessageProps } from "../../../../components/Message/types";

/**
 * Fork of original Message component. Created in order not to break existing e2e tests (requires assets re-generation).
 */
export default function Message({ text, sender }: MessageProps) {
  return (
    <View style={sender ? styles.senderContainer : styles.recipientContainer}>
      <Text style={sender ? styles.senderMessage : styles.recipientMessage}>
        {text}
      </Text>
    </View>
  );
}

const container = {
  borderRadius: 20,
  paddingHorizontal: 14,
  paddingVertical: 10,
  marginHorizontal: 12,
  marginVertical: 2,
  maxWidth: "78%" as const,
};

const styles = StyleSheet.create({
  senderContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    ...container,
  },
  recipientContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#E8E8ED",
    ...container,
  },
  senderMessage: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
  },
  recipientMessage: {
    color: "#1C1C1E",
    fontSize: 16,
    lineHeight: 22,
  },
});
