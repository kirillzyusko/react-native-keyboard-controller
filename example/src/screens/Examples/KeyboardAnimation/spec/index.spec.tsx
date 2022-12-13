import React from 'react';
import { render } from '@testing-library/react-native';

import { setKeyboardPosition } from 'react-native-keyboard-controller/jest';

import KeyboardAnimation from '../index';

describe('unit test sample', () => {
  it('should match to snapshot', () => {
    const screen = render(<KeyboardAnimation />);

    setKeyboardPosition(100);

    expect(screen).toMatchSnapshot();
  });
});
