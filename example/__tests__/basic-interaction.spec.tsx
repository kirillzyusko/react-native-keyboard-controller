import React from 'react';
import { render } from '@testing-library/react-native';

import {
  setKeyboardPosition,
  setKeyboardVisibleHeight,
} from 'react-native-keyboard-controller/jest';

import KeyboardAnimation from '../index';

beforeAll(() => {
  setKeyboardVisibleHeight(400);
});

describe('unit test sample', () => {
  it('should match to snapshot', () => {
    const { update, toJSON } = render(<KeyboardAnimation />);

    setKeyboardPosition(200);
    update(<KeyboardAnimation />);

    expect(toJSON()).toMatchSnapshot();
  });
});
