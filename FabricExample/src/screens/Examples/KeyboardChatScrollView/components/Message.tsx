import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { MessageProps } from "../../../../components/Message/types";

/**
 * Fork of original Message component. Created in order not to break existing e2e tests (requires assets re-generation).
 */
export default function Message({ text, sender }: MessageProps) {
  return (
    <View style={sender ? styles.senderContainer : styles.recipientContainer}>
      <Text style={styles.message}>{text}</Text>
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
    color: "#000000",
  },
});
