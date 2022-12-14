import '@testing-library/jest-native/extend-expect';
import React from 'react';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import { render } from '@testing-library/react-native';

import { setKeyboardPosition } from 'react-native-keyboard-controller/jest';

import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';

function TestComponent() {
  const { height } = useReanimatedKeyboardAnimation();
  const style = useAnimatedStyle(
    () => ({
      width: 20,
      height: 20,
      backgroundColor: 'red',
      transform: [{ translateY: height.value }],
    }),
    []
  );

  return <Reanimated.View testID="view" style={style} />;
}

describe('unit test sample', () => {
  it('should have `0` translate when keyboard is not shown', () => {
    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('view')).toHaveStyle({ transform: [{ translateY: 0 }] });
  });

  it(`should have 300 translate when keyboard is shown`, () => {
    const { getByTestId, update } = render(<TestComponent />);

    setKeyboardPosition(300);
    update(<TestComponent />);

    expect(getByTestId('view')).toHaveStyle({
      transform: [{ translateY: 300 }],
    });
  });
});
