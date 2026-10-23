/* global globalThis */
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  AppRegistry,
  Keyboard,
  LogBox,
  Pressable,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  KeyboardProvider,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { name as appName } from "./app.json";
import InteractiveKeyboardIOS from "./src/screens/Examples/InteractiveKeyboardIOS";

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs();
const record = (event, data) => {
  globalThis.__issue243Trace?.events.push({ event, data, wall: Date.now() });
};
const cases = [
  ["edge-auto", "Edge · auto dismiss", false, true],
  ["full-auto", "Full screen · auto dismiss", true, true],
  ["edge-keep", "Edge · no explicit dismiss", false, false],
  ["full-keep", "Full screen · no explicit dismiss", true, false],
];

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 18 }}>
      {cases.map(
        ([id, label, fullScreenGestureEnabled, keyboardHandlingEnabled]) => (
          <Pressable
            key={id}
            style={{ padding: 18, backgroundColor: "#e8edf4" }}
            testID={id}
            onPress={() =>
              navigation.navigate("Interactive", {
                fullScreenGestureEnabled,
                keyboardHandlingEnabled,
              })
            }
          >
            <Text>{label}</Text>
          </Pressable>
        ),
      )}
    </View>
  );
}

function Trace({ navigation, route }) {
  useEffect(() => {
    globalThis.__issue243Trace = { mode: route.params, events: [] };
    record("mode", route.params);
    const listeners = [
      "keyboardWillShow",
      "keyboardDidShow",
      "keyboardWillHide",
      "keyboardDidHide",
      "keyboardWillChangeFrame",
      "keyboardDidChangeFrame",
    ].map((name) => Keyboard.addListener(name, (e) => record(name, e)));
    const unsubs = ["transitionStart", "transitionEnd"].map((name) =>
      navigation.addListener(name, (e) => record(name, e.data)),
    );

    return () => {
      listeners.forEach((x) => x.remove());
      unsubs.forEach((x) => x());
    };
  }, [navigation, route.params]);
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

function Interactive(props) {
  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <InteractiveKeyboardIOS />
      <Trace {...props} />
    </SafeAreaView>
  );
}

function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider statusBarTranslucent>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen component={Home} name="Home" />
              <Stack.Screen
                component={Interactive}
                name="Interactive"
                options={({ route }) => ({
                  title: "Interactive Keyboard iOS",
                  ...route.params,
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
AppRegistry.registerComponent(appName, () => App);
