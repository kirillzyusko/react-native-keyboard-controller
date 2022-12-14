import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { Animated } from 'react-native';
import { render } from '@testing-library/react-native';

import {
  setKeyboardPosition,
  setKeyboardVisibleHeight,
} from 'react-native-keyboard-controller/jest';

import { useKeyboardAnimation } from 'react-native-keyboard-controller';

function TestComponent() {
  const { height } = useKeyboardAnimation();

  return (
    <Animated.View
      testID="view"
      style={{ transform: [{ translateY: height }] }}
    />
  );
}

const KEYBOARD_HEIGHT = 400;
const INTERMEDIATE_KEYBOARD_HEIGHT = KEYBOARD_HEIGHT / 2;

beforeAll(() => {
  setKeyboardVisibleHeight(KEYBOARD_HEIGHT);
});

describe('unit test sample', () => {
  it('should have `0` translate when keyboard is not shown', () => {
    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('view')).toHaveStyle({ transform: [{ translateY: 0 }] });
  });

  it(`should have \`${KEYBOARD_HEIGHT}\` translate when keyboard is not shown`, () => {
    const { getByTestId } = render(<TestComponent />);

    setKeyboardPosition(KEYBOARD_HEIGHT);

    expect(getByTestId('view')).toHaveStyle({
      transform: [{ translateY: KEYBOARD_HEIGHT }],
    });
  });

  it(`should have \`${INTERMEDIATE_KEYBOARD_HEIGHT}\` translate when keyboard is hiding`, () => {
    const { getByTestId } = render(<TestComponent />);

    setKeyboardPosition(INTERMEDIATE_KEYBOARD_HEIGHT);

    expect(getByTestId('view')).toHaveStyle({
      transform: [{ translateY: INTERMEDIATE_KEYBOARD_HEIGHT }],
    });
  });
});
