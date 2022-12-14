import React from 'react';
import { View } from 'react-native';
import {
  KeyboardControllerView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import { render } from '@testing-library/react-native';

function KeyboardControllerViewTest() {
  return <KeyboardControllerView statusBarTranslucent />;
}

function KeyboardProviderTest() {
  return (
    <KeyboardProvider statusBarTranslucent>
      <View style={{ width: 20, height: 20, backgroundColor: 'black' }} />
    </KeyboardProvider>
  );
}

describe('components rendering', () => {
  it('should render `KeyboardControllerView`', () => {
    expect(render(<KeyboardControllerViewTest />)).toMatchSnapshot();
  });

  it('should render `KeyboardProvider`', () => {
    expect(render(<KeyboardProviderTest />)).toMatchSnapshot();
  });
});
