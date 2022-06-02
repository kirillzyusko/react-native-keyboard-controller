import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { ScreenNames } from '../../constants/screenNames';
import KeyboardAnimation from '../../screens/Examples/KeyboardAnimation';
import ReanimatedChat from '../../screens/Examples/ReanimatedChat';
import Events from '../../screens/Examples/Events';
import AwareScrollView from '../../screens/Examples/AwareScrollView';
import StatusBar from '../../screens/Examples/StatusBar';

type ExamplesStackParamList = {
  [ScreenNames.ANIMATED_EXAMPLE]: undefined;
  [ScreenNames.REANIMATED_CHAT]: undefined;
  [ScreenNames.EVENTS]: undefined;
  [ScreenNames.AWARE_SCROLL_VIEW]: undefined;
  [ScreenNames.STATUS_BAR]: undefined;
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
  [ScreenNames.AWARE_SCROLL_VIEW]: {
    title: 'Aware scroll view',
  },
  [ScreenNames.STATUS_BAR]: {
    title: 'Status bar manipulation',
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
    <Stack.Screen
      name={ScreenNames.AWARE_SCROLL_VIEW}
      component={AwareScrollView}
      options={options[ScreenNames.AWARE_SCROLL_VIEW]}
    />
    <Stack.Screen
      name={ScreenNames.STATUS_BAR}
      component={StatusBar}
      options={options[ScreenNames.STATUS_BAR]}
    />
  </Stack.Navigator>
);

export default ExamplesStack;
