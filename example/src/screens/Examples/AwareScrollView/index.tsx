import React from 'react';
import { ScrollView, TextInput } from 'react-native';
import { useResizeMode } from 'react-native-keyboard-controller';

import { randomColor } from '../../../utils';

import KeyboardAwareScrollView from './KeyboardAwareScrollView';
import { styles } from './styles';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function AwareScrollView() {
  useResizeMode();

  return (
    <KeyboardAwareScrollView style={styles.container}>
      {new Array(10).fill(0).map((_, i) => (
        <TextInput
          key={i}
          placeholder={`${i}`}
          keyboardType={i % 2 === 0 ? 'numeric' : 'default'}
          placeholderTextColor="black"
          style={{
            width: '100%',
            height: 50,
            backgroundColor: randomColor(),
            marginTop: 50,
          }}
        />
      ))}
    </KeyboardAwareScrollView>
  );
}
