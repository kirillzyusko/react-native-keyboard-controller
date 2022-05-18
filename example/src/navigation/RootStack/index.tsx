import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { ScreenNames } from '../../constants/screenNames';
import ExamplesStack from '../ExamplesStack';
import ExampleMain from '../../screens/Examples/Main';

export type RootStackParamList = {
  [ScreenNames.EXAMPLES]: undefined;
  [ScreenNames.EXAMPLES_STACK]: {};
};

const Stack = createStackNavigator<RootStackParamList>();

const options = {
  [ScreenNames.EXAMPLES_STACK]: { headerShown: false },
  [ScreenNames.EXAMPLES]: { title: 'Examples' },
};

const RootStack = () => (
  <Stack.Navigator initialRouteName={ScreenNames.EXAMPLES}>
    <Stack.Screen
      name={ScreenNames.EXAMPLES}
      component={ExampleMain}
      options={options[ScreenNames.EXAMPLES]}
    />
    <Stack.Screen
      name={ScreenNames.EXAMPLES_STACK}
      component={ExamplesStack}
      options={options[ScreenNames.EXAMPLES_STACK]}
    />
  </Stack.Navigator>
);

export default RootStack;
