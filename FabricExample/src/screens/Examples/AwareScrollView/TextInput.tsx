import React from 'react';
import { TextInputProps, TextInput as TextInputRN } from 'react-native';
import { randomColor } from '../../../utils';

const TextInput = (props: TextInputProps) => {
  return (
    <TextInputRN
      placeholderTextColor="black"
      style={{
        width: '100%',
        minHeight: 50,
        maxHeight: 200,
        backgroundColor: randomColor(),
        marginTop: 50,
      }}
      multiline
      numberOfLines={10}
      {...props}
    />
  );
};

export default TextInput;
