import React from 'react';
import { useResizeMode } from 'react-native-keyboard-controller';

import KeyboardAwareScrollView from './KeyboardAwareScrollView';
import TextInput from './TextInput';
import { styles } from './styles';
import { Keyboard, ScrollView, View } from 'react-native';

export default function AwareScrollView() {
  useResizeMode();

  return (
    <View style={{flex: 1}}>
    <KeyboardAwareScrollView>
      {new Array(10).fill(0).map((_, i) => (
        <TextInput
          key={i}
          placeholder={`${i}`}
          keyboardType={i % 2 === 0 ? 'numeric' : 'default'}
        />
      ))}
    </KeyboardAwareScrollView>
    </View>
  );
}
