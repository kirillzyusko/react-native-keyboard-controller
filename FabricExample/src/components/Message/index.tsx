import React from "react";
import { Text, View } from "react-native";

import styles from "./styles";

import type { MessageProps } from "./types";

export default function Message({ text, sender }: MessageProps) {
  return (
    <View style={sender ? styles.senderContainer : styles.recipientContainer}>
      <Text style={styles.message}>{text}</Text>
    </View>
  );
}
