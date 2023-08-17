import React from 'react';

import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { ScreenNames } from '../../constants/screenNames';
import KeyboardAnimation from '../../screens/Examples/KeyboardAnimation';

export type NativeStackParamList = {
  [ScreenNames.NATIVE_STACK]: {};
};

const Stack = createNativeStackNavigator<NativeStackParamList>();

const options: Record<string, NativeStackNavigationOptions> = {
  [ScreenNames.NATIVE_STACK]: {
    headerShown: false,
    statusBarTranslucent: true,
  },
};

const NativeStack = () => (
  <Stack.Navigator initialRouteName={ScreenNames.NATIVE_STACK}>
    <Stack.Screen
      name={ScreenNames.NATIVE_STACK}
      component={KeyboardAnimation}
      options={options[ScreenNames.NATIVE_STACK]}
    />
  </Stack.Navigator>
);

export default NativeStack;
