import React from 'react';
import { render } from '@testing-library/react-native';

import KeyboardAnimation from '../index';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('unit test sample', () => {
  it('should match to snapshot', () => {
    const screen = render(<KeyboardAnimation />);

    expect(screen).toMatchSnapshot();
  });
});
