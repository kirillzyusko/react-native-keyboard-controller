import React from 'react';
import { render } from '@testing-library/react-native';

import { setKeyboardPosition } from 'react-native-keyboard-controller/jest/mock';

import KeyboardAnimation from '../index';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('unit test sample', () => {
  it('should match to snapshot', () => {
    const screen = render(<KeyboardAnimation />);

    setKeyboardPosition(100);

    expect(screen).toMatchSnapshot();
  });
});
