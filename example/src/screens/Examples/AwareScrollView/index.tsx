import React from 'react';
import { useResizeMode } from 'react-native-keyboard-controller';

import KeyboardAwareScrollView from './KeyboardAwareScrollView';
import TextInput from './TextInput';
import { styles } from './styles';

export default function AwareScrollView() {
  useResizeMode();

  return (
    <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.content}>
      {new Array(10).fill(0).map((_, i) => (
        <TextInput
          key={i}
          placeholder={`TextInput#${i}`}
          keyboardType={i % 2 === 0 ? 'numeric' : 'default'}
        />
      ))}
    </KeyboardAwareScrollView>
  );
}
