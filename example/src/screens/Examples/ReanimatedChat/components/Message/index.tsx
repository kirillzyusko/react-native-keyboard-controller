import React from 'react';
import { Text, View } from 'react-native';
import type { MessageProps } from '../../types';
import styles from './styles';

export default function Message({ text, sender }: MessageProps) {
  return (
    <View style={sender ? styles.senderContainer : styles.recipientContainer}>
      <Text>{text}</Text>
    </View>
  );
}
