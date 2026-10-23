/* global globalThis */
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { AppRegistry, Keyboard, LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  KeyboardProvider,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { name as appName } from "./app.json";
import InteractiveBackSwipe from "./src/screens/Examples/InteractiveBackSwipe";

globalThis.__backSwipePlaygroundTrace = [];
LogBox.ignoreAllLogs();
const record = (event, data) => {
  globalThis.__backSwipePlaygroundTrace.push({ event, data, wall: Date.now() });
};

function Trace() {
  useEffect(() => {
    const subscriptions = [
      "keyboardWillShow",
      "keyboardWillHide",
      "keyboardDidShow",
      "keyboardDidHide",
    ].map((name) => Keyboard.addListener(name, (e) => record(name, e)));

    return () => subscriptions.forEach((x) => x.remove());
  }, []);
  useKeyboardHandler({
    onStart: (e) => {
      "worklet";
      scheduleOnRN(record, "KC.onStart", e);
    },
    onMove: (e) => {
      "worklet";
      scheduleOnRN(record, "KC.onMove", e);
    },
    onInteractive: (e) => {
      "worklet";
      scheduleOnRN(record, "KC.onInteractive", e);
    },
    onEnd: (e) => {
      "worklet";
      scheduleOnRN(record, "KC.onEnd", e);
    },
  });

  return null;
}

function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider statusBarTranslucent>
          <NavigationContainer>
            <InteractiveBackSwipe />
            <Trace />
          </NavigationContainer>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
