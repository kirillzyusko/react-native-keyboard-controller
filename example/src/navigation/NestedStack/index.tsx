import React from 'react';

import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { ScreenNames } from '../../constants/screenNames';
import KeyboardAnimation from '../../screens/Examples/KeyboardAnimation';

export type NativeStackParamList = {
  [ScreenNames.NATIVE]: {};
};

const Stack = createNativeStackNavigator<NativeStackParamList>();

const options: Record<string, NativeStackNavigationOptions> = {
  [ScreenNames.NATIVE]: {
    headerShown: false,
    statusBarTranslucent: true,
  },
};

const NativeStack = () => (
  <Stack.Navigator initialRouteName={ScreenNames.NATIVE}>
    <Stack.Screen
      name={ScreenNames.NATIVE}
      component={KeyboardAnimation}
      options={options[ScreenNames.NATIVE]}
    />
  </Stack.Navigator>
);

export default NativeStack;
