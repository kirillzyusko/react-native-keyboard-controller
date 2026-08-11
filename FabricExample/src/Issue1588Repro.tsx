import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  type TextInputKeyPressEventData,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

type ReproStackParamList = {
  Issue1588A: undefined;
  Issue1588B: undefined;
};

const Stack = createNativeStackNavigator<ReproStackParamList>();
const screenOptions = { headerShown: false } as const;

const log = (message: string) => {
  console.log(`[ISSUE-1588][JS] ${message}`);
};

function ScreenA({
  navigation,
}: {
  navigation: { navigate: (screen: "Issue1588B") => void };
}) {
  const [value, setValue] = useState("");
  const [probeValue, setProbeValue] = useState("");
  const inputARef = useRef<TextInput>(null);
  const probeInputRef = useRef<TextInput>(null);

  const onChangeText = useCallback((text: string) => {
    log(`A onChangeText text=${JSON.stringify(text)} length=${text.length}`);
    setValue(text);
  }, []);

  const onKeyPress = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      log(`A onKeyPress key=${JSON.stringify(nativeEvent.key)}`);
    },
    [],
  );

  const onBlur = useCallback(() => log("A onBlur"), []);
  const onFocus = useCallback(() => log("A onFocus"), []);
  const onProbeBlur = useCallback(() => log("Probe B onBlur"), []);
  const onProbeChangeText = useCallback((text: string) => {
    log(
      `Probe B onChangeText text=${JSON.stringify(text)} length=${text.length}`,
    );
    setProbeValue(text);
  }, []);
  const onProbeFocus = useCallback(() => log("Probe B onFocus"), []);
  const onProbeKeyPress = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      log(`Probe B onKeyPress key=${JSON.stringify(nativeEvent.key)}`);
    },
    [],
  );
  const triggerFocusChurn = useCallback(() => {
    log("Triggering same-turn Probe B -> A -> Probe B focus churn");
    probeInputRef.current?.focus();
    inputARef.current?.focus();
    probeInputRef.current?.focus();
  }, []);
  const navigateToB = useCallback(() => {
    log(`A navigating to B with length=${value.length}`);
    navigation.navigate("Issue1588B");
  }, [navigation, value.length]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Issue #1588 — Screen A</Text>
        <Text>Type exactly 3 characters, then tap Next.</Text>
        <TextInput
          ref={inputARef}
          autoFocus
          accessibilityLabel="Issue 1588 input A"
          maxLength={3}
          style={styles.input}
          testID="issue-1588-input-a"
          value={value}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onKeyPress={onKeyPress}
        />
        <Text testID="issue-1588-value-a">
          A value: {JSON.stringify(value)} ({value.length}/3)
        </Text>
        <TextInput
          ref={probeInputRef}
          accessibilityLabel="Issue 1588 focus-churn probe"
          placeholder="Focus-churn target"
          style={styles.input}
          testID="issue-1588-probe-b"
          value={probeValue}
          onBlur={onProbeBlur}
          onChangeText={onProbeChangeText}
          onFocus={onProbeFocus}
          onKeyPress={onProbeKeyPress}
        />
        <Button
          testID="issue-1588-churn"
          title="Trigger same-turn B -> A -> B"
          onPress={triggerFocusChurn}
        />
        <Button
          testID="issue-1588-next"
          title="Next without dismissing keyboard"
          onPress={navigateToB}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function ScreenB() {
  const [value, setValue] = useState("");

  const onChangeText = useCallback((text: string) => {
    log(`B onChangeText text=${JSON.stringify(text)} length=${text.length}`);
    setValue(text);
  }, []);

  const onKeyPress = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      log(`B onKeyPress key=${JSON.stringify(nativeEvent.key)}`);
    },
    [],
  );
  const onBlur = useCallback(() => log("B onBlur"), []);
  const onFocus = useCallback(() => log("B onFocus"), []);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Issue #1588 — Screen B</Text>
        <Text>
          This input should accept text. The issue predicts no key/change events
          after Screen A reaches maxLength.
        </Text>
        <TextInput
          autoFocus
          accessibilityLabel="Issue 1588 input B"
          style={styles.input}
          testID="issue-1588-input-b"
          value={value}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onKeyPress={onKeyPress}
        />
        <Text testID="issue-1588-value-b">
          B value: {JSON.stringify(value)} ({value.length})
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function Issue1588Repro() {
  return (
    <Stack.Navigator
      initialRouteName="Issue1588A"
      screenOptions={screenOptions}
    >
      <Stack.Screen component={ScreenA} name="Issue1588A" />
      <Stack.Screen component={ScreenB} name="Issue1588B" />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    gap: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  input: {
    borderColor: "#777",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 20,
    minHeight: 48,
    paddingHorizontal: 12,
  },
});
