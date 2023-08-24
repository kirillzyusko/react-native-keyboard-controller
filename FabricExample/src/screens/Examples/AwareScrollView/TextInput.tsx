import React from 'react';
import { TextInputProps, TextInput as TextInputRN } from 'react-native';
import { randomColor } from '../../../utils';
import { useAwareScrollView } from './context';

const TextInput = React.forwardRef((props: TextInputProps, forwardRef) => {
  const { onRef } = useAwareScrollView();

  return (
    <TextInputRN
      ref={(ref) => {
        onRef(ref);
        if (typeof forwardRef === 'function') {
          forwardRef(ref);
        }
      }}
      placeholderTextColor="black"
      style={{
        width: '100%',
        height: 50,
        backgroundColor: randomColor(),
        marginTop: 50,
      }}
      {...props}
    />
  );
});

export default TextInput;
