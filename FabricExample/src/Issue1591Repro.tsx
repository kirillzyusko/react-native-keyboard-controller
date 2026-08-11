import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useGenericKeyboardHandler } from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";

type ReproStackParamList = {
  Issue1591A: undefined;
  Issue1591B: undefined;
};

const Stack = createNativeStackNavigator<ReproStackParamList>();

function KeyboardMoveLogger() {
  const flight = useSharedValue(0);
  const moveCount = useSharedValue(0);

  /* eslint-disable react-compiler/react-compiler -- worklet shared values are intentionally mutated on the UI runtime */
  useGenericKeyboardHandler(
    {
      onStart: (event) => {
        "worklet";

        flight.value += 1;
        moveCount.value = 0;
        console.log(
          `[ISSUE-1591] START flight=${flight.value} targetHeight=${event.height}`,
        );
      },
      onMove: (event) => {
        "worklet";

        moveCount.value += 1;
        console.log(
          `[ISSUE-1591] MOVE flight=${flight.value} frame=${moveCount.value} height=${event.height}`,
        );
      },
      onEnd: (event) => {
        "worklet";

        console.log(
          `[ISSUE-1591] END flight=${flight.value} targetHeight=${event.height} moves=${moveCount.value}`,
        );
      },
    },
    [],
  );
  /* eslint-enable react-compiler/react-compiler */

  return null;
}

function ScreenA({
  navigation,
}: {
  navigation: { navigate: (screen: "Issue1591B") => void };
}) {
  const pushScreenB = React.useCallback(() => {
    navigation.navigate("Issue1591B");
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Issue #1591 — Screen A</Text>
      <Text style={styles.instructions}>
        Push Screen B, focus its input, pop back while the keyboard is open,
        then repeat. Every keyboard flight should report a non-zero MOVE count.
      </Text>
      <Button
        testID="issue-1591-push"
        title="Push Screen B"
        onPress={pushScreenB}
      />
    </View>
  );
}

function ScreenB() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Issue #1591 — Screen B</Text>
      <Text style={styles.instructions}>
        Focus the input, then use the native Back button while the keyboard is
        still open.
      </Text>
      <TextInput
        accessibilityLabel="Issue 1591 keyboard input"
        placeholder="Tap to show keyboard"
        style={styles.input}
        testID="issue-1591-input"
      />
    </View>
  );
}

export default function Issue1591Repro() {
  return (
    <>
      <KeyboardMoveLogger />
      <Stack.Navigator initialRouteName="Issue1591A">
        <Stack.Screen
          component={ScreenA}
          name="Issue1591A"
          options={screenAOptions}
        />
        <Stack.Screen
          component={ScreenB}
          name="Issue1591B"
          options={screenBOptions}
        />
      </Stack.Navigator>
    </>
  );
}

const screenAOptions = { title: "Issue #1591" };
const screenBOptions = { title: "Keyboard screen" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  instructions: {
    fontSize: 16,
    lineHeight: 23,
  },
  input: {
    borderColor: "#777",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 18,
    minHeight: 52,
    paddingHorizontal: 12,
  },
});
