import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import TextInput from '../../../components/TextInput';
import { styles } from './styles';

export default function AwareScrollView() {
  return (
    <KeyboardAwareScrollView testID='aware_scroll_view_container' bottomOffset={50} style={styles.container} contentContainerStyle={styles.content}>
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
