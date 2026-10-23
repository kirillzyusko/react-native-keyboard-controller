import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { AppRegistry, Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  KeyboardController,
  KeyboardProvider,
} from "react-native-keyboard-controller";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { name } from "./app.json";
import Issue1215 from "./src/diagnostics/Issue1215";
import InteractiveBackSwipe from "./src/screens/Examples/InteractiveBackSwipe";

function Action({ id, children, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      style={styles.button}
      testID={id}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}

function App() {
  const [screen, setScreen] = useState(null);
  const [snapshot, setSnapshot] = useState("off");

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        {screen ? (
          <>
            <SafeAreaView edges={["top"]} style={styles.toolbar}>
              <Action id="transitions.home" onPress={() => setScreen(null)}>
                All experiments
              </Action>
            </SafeAreaView>
            {screen === "swipe" ? (
              <KeyboardProvider>
                <NavigationContainer>
                  <InteractiveBackSwipe />
                </NavigationContainer>
              </KeyboardProvider>
            ) : (
              <Issue1215 withBackdrop />
            )}
          </>
        ) : (
          <SafeAreaView style={styles.home}>
            <View style={styles.actions} testID="transitions.menu">
              <Text style={styles.title}>Keyboard transitions</Text>
              <Text>Experimental APIs · native stack · bundled JS</Text>
              <Action id="transitions.swipe" onPress={() => setScreen("swipe")}>
                Interactive back swipe
              </Action>
              <Action id="transitions.gray" onPress={() => setScreen("gray")}>
                Gray keyboard: native push + autofocus
              </Action>
              <Action
                id="transitions.snapshot.enable"
                onPress={async () => {
                  const installed =
                    await KeyboardController.fixKeyboardTransition();

                  setSnapshot(installed ? "on" : "unavailable");
                }}
              >
                Enable live keyboard snapshot
              </Action>
              <Text testID="transitions.snapshot.status">
                Live snapshot: {snapshot}
              </Text>
              <Text>
                Uses private UIKit APIs. Enable before opening the gray keyboard
                example. Force quit and reopen to turn it off. Back swipe works
                independently of this switch.
              </Text>
            </View>
          </SafeAreaView>
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  home: { flex: 1, justifyContent: "center", padding: 24 },
  actions: { gap: 16 },
  title: { fontSize: 25, fontWeight: "600" },
  toolbar: { paddingHorizontal: 16, backgroundColor: "white" },
  button: { borderRadius: 12, padding: 14, backgroundColor: "#edf2f7" },
  buttonText: { color: "#111827", fontWeight: "600" },
});

AppRegistry.registerComponent(name, () => App);
