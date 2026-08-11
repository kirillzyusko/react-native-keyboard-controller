import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import Issue1591Repro from "./Issue1591Repro";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const linking = {
  prefixes: ["https://rnkcfabricexample.com", "rnkcfabricexample://"],
  config: {
    initialRouteName: "EXAMPLES_STACK" as const,
    screens: {
      EXAMPLES_STACK: {
        path: "examples",
        screens: {
          ANIMATED_EXAMPLE: {
            path: "animated",
          },
        },
      },
    },
  },
};
const spinner = <ActivityIndicator color="blue" size="large" />;

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={styles.root}>
        <KeyboardProvider statusBarTranslucent>
          <NavigationContainer fallback={spinner} linking={linking}>
            <StatusBar
              animated
              translucent
              backgroundColor={"#FFFFFF00"}
              barStyle={"dark-content"}
            />
            <Issue1591Repro />
          </NavigationContainer>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
