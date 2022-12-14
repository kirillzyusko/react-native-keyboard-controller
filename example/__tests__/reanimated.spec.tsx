import '@testing-library/jest-native/extend-expect';
import React from 'react';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import { render } from '@testing-library/react-native';

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

describe('basic keyboard interaction', () => {
  it('should have different styles depends on position', () => {
    const { getByTestId, update } = render(<TestComponent />);

    expect(getByTestId('view')).toHaveStyle({ transform: [{ translateY: 0 }] });

    (useReanimatedKeyboardAnimation as jest.Mock).mockReturnValue({
      height: { value: 150 },
      progress: { progress: 0.5 },
    });
    update(<TestComponent />);

    expect(getByTestId('view')).toHaveStyle({
      transform: [{ translateY: 150 }],
    });

    (useReanimatedKeyboardAnimation as jest.Mock).mockReturnValue({
      height: { value: 300 },
      progress: { progress: 1 },
    });
    update(<TestComponent />);

    expect(getByTestId('view')).toHaveStyle({
      transform: [{ translateY: 300 }],
    });
  });
});
