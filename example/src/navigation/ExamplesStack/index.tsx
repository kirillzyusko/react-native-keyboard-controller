import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { ScreenNames } from '../../constants/screenNames';
import KeyboardAnimation from '../../screens/Examples/KeyboardAnimation';
import ReanimatedChat from '../../screens/Examples/ReanimatedChat';
import Events from '../../screens/Examples/Events';

type ExamplesStackParamList = {
  [ScreenNames.ANIMATED_EXAMPLE]: undefined;
  [ScreenNames.REANIMATED_CHAT]: undefined;
  [ScreenNames.EVENTS]: undefined;
};

const Stack = createStackNavigator<ExamplesStackParamList>();

const options = {
  [ScreenNames.ANIMATED_EXAMPLE]: {
    title: 'Keyboard animation ⌨️',
  },
  [ScreenNames.REANIMATED_CHAT]: {
    title: 'Chat',
  },
  [ScreenNames.EVENTS]: {
    title: 'Events',
  },
};

const ExamplesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={ScreenNames.ANIMATED_EXAMPLE}
      component={KeyboardAnimation}
      options={options[ScreenNames.ANIMATED_EXAMPLE]}
    />
    <Stack.Screen
      name={ScreenNames.REANIMATED_CHAT}
      component={ReanimatedChat}
      options={options[ScreenNames.REANIMATED_CHAT]}
    />
    <Stack.Screen
      name={ScreenNames.EVENTS}
      component={Events}
      options={options[ScreenNames.EVENTS]}
    />
  </Stack.Navigator>
);

export default ExamplesStack;
