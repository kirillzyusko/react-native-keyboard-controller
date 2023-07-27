import React from 'react';
import { TextInput as TextInputRN } from 'react-native';
import { randomColor } from '../../../utils';
import { useAwareScrollView } from './context';

type Props = {
  id: number;
};

function TextInput({ id }: Props, forwardRef) {
  const { onRef } = useAwareScrollView();

  return (
    <TextInputRN
      ref={ref => {
        onRef(ref);
        forwardRef?.(ref);
      }}
      placeholder={`${id}`}
      placeholderTextColor="black"
      style={{
        width: '100%',
        height: 50,
        backgroundColor: randomColor(),
        marginTop: 50,
      }}
    />
  );
}

export default React.forwardRef(TextInput);
