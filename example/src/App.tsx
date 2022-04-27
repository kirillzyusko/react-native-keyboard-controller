import 'react-native-gesture-handler';

import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import {
  KeyboardProvider,
  KeyboardReanimatedProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import RootStack from './navigation/RootStack';

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
