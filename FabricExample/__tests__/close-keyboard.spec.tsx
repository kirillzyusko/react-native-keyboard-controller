import React from 'react';
import { Button } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { KeyboardController } from 'react-native-keyboard-controller';

function CloseKeyboard() {
  return (
    <Button
      title="Close keyboard"
      testID="close_keyboard"
      onPress={() => KeyboardController.dismiss()}
    />
  );
}

describe('closing keyboard flow', () => {
  it('should have a mock version of `KeyboardController.dismiss`', () => {
    const { getByTestId } = render(<CloseKeyboard />);

    fireEvent.press(getByTestId('close_keyboard'));

    expect(KeyboardController.dismiss).toBeCalledTimes(1);
  });
});
