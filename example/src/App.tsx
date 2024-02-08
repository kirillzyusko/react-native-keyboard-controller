import "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardController, KeyboardProvider } from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import RootStack from "./navigation/RootStack";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const linking = {
  prefixes: ["https://rnkcexample.com", "rnkcexample://"],
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


KeyboardController.multiply(2, 6).then(console.log)
export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={styles.root}>
        <KeyboardProvider statusBarTranslucent>
          <BottomSheetModalProvider>
            <NavigationContainer linking={linking} fallback={spinner}>
              <RootStack />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
