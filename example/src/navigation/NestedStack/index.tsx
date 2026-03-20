import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { ScreenNames } from "../../constants/screenNames";
import KeyboardAnimation from "../../screens/Examples/KeyboardAnimation";

import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export type NativeStackParamList = {
  [ScreenNames.NATIVE]: undefined;
};

const Stack = createNativeStackNavigator<NativeStackParamList>();

const options: Record<string, NativeStackNavigationOptions> = {
  [ScreenNames.NATIVE]: {
    headerShown: false,
    statusBarTranslucent: true,
    navigationBarColor: "#FFFFFF",
  },
};

const NativeStack = () => (
  <Stack.Navigator initialRouteName={ScreenNames.NATIVE}>
    <Stack.Screen
      component={KeyboardAnimation}
      name={ScreenNames.NATIVE}
      options={options[ScreenNames.NATIVE]}
    />
  </Stack.Navigator>
);

export default NativeStack;
