import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import * as React from "react";
import { ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import RootStack from "./navigation/RootStack";

const reactNavigationIntegration = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: "https://0905d52a3f30e7cd133356589b93471d@o4508144786997248.ingest.de.sentry.io/4508144789160016",
  integrations: [
    new Sentry.ReactNativeTracing({
      enableAppStartTracking: true,
      enableNativeFramesTracking: true,
      enableStallTracking: true,
      enableUserInteractionTracing: true,
    }),
  ],
});

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

function App() {
  const containerRef = React.useRef();

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={styles.root}>
        <KeyboardProvider statusBarTranslucent>
          <NavigationContainer
            ref={containerRef}
            fallback={spinner}
            linking={linking}
            onReady={() => {
              reactNavigationIntegration.registerNavigationContainer(
                containerRef,
              );
            }}
          >
            <StatusBar
              animated
              translucent
              backgroundColor={"#FFFFFF00"}
              barStyle={"dark-content"}
            />
            <RootStack />
          </NavigationContainer>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(App);
