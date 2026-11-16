// cspell:ignore Pressable
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  findNodeHandle,
} from "react-native";
import {
  FocusedInputEvents,
  KeyboardController,
  KeyboardProvider,
} from "react-native-keyboard-controller";

type Mode = "autoFocus" | "onShow" | "manual";
const trace: object[] = [];
const record = (name: string, value: unknown) => {
  trace.push({ name, value, time: Date.now() });
  console.log("[issue1768-focus]", name, value);
};

function Repro() {
  const a = useRef<TextInput>(null);
  const b = useRef<TextInput>(null);
  const [mode, setMode] = useState<Mode>("autoFocus");
  const [animation, setAnimation] = useState<"none" | "slide">("none");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("Tap state() to read keyboard metadata");
  const [dismissStatus, setDismissStatus] = useState("Not requested");
  const [focusCount, setFocusCount] = useState(0);
  const request = useRef(0);

  useEffect(() => {
    const subscription = FocusedInputEvents.addListener(
      "focusDidSet",
      (event) => {
        setFocusCount((count) => count + 1);
        record("focusDidSet", event);
      },
    );

    return () => subscription.remove();
  }, []);

  const readState = () => {
    const state = KeyboardController.state();
    const expected = findNodeHandle(visible ? b.current : a.current);

    setStatus(
      `Expected ${visible ? "B" : "A"}: ${expected}\n` +
        `target: ${state.target}  type: ${state.type}\n` +
        `visible: ${KeyboardController.isVisible()}  height: ${Math.round(
          state.height,
        )}`,
    );
    record("state", {
      expected,
      ...state,
      visible: KeyboardController.isVisible(),
    });
  };
  const dismiss = () => {
    const id = ++request.current;

    setDismissStatus("Pending");
    record("dismiss", KeyboardController.state());
    KeyboardController.dismiss().then(() => {
      if (id === request.current) {
        setDismissStatus("Resolved");
      }
      record("dismiss.resolved", KeyboardController.state());
    });
  };
  const open = () => {
    request.current += 1;
    setDismissStatus("Not requested");
    setStatus("Tap state() to read keyboard metadata");
    record("open", { mode, animation });
    setVisible(true);
  };
  const controls = (
    <>
      <View style={styles.row}>
        <Pressable
          style={styles.button}
          testID="read-state"
          onPress={readState}
        >
          <Text>state()</Text>
        </Pressable>
        <Pressable style={styles.button} testID="dismiss" onPress={dismiss}>
          <Text>dismiss()</Text>
        </Pressable>
      </View>
      <Text style={styles.state} testID="keyboard-state">
        {status}
      </Text>
      <Text testID="dismiss-status">Dismiss: {dismissStatus}</Text>
      <Text testID="focus-count">focusDidSet: {focusCount}</Text>
    </>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Screen A · default keyboard</Text>
      <TextInput
        ref={a}
        placeholder="Input A"
        style={styles.input}
        testID="input-a"
      />
      <View style={styles.row}>
        {(["autoFocus", "onShow", "manual"] as const).map((value) => (
          <Pressable
            key={value}
            style={[styles.button, mode === value && styles.selected]}
            testID={`mode-${value}`}
            onPress={() => setMode(value)}
          >
            <Text>{value}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        {(["none", "slide"] as const).map((value) => (
          <Pressable
            key={value}
            style={[styles.button, animation === value && styles.selected]}
            testID={`animation-${value}`}
            onPress={() => setAnimation(value)}
          >
            <Text>{value}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.button} testID="open-modal" onPress={open}>
          <Text>Open B</Text>
        </Pressable>
      </View>
      {controls}
      <Modal
        statusBarTranslucent
        transparent
        animationType={animation}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onShow={() => {
          if (mode === "onShow") {
            b.current?.focus();
          }
        }}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.title}>Modal B · number-pad</Text>
            <Text>
              {mode} / {animation}
            </Text>
            <TextInput
              ref={b}
              autoFocus={mode === "autoFocus"}
              keyboardType="number-pad"
              placeholder="Input B"
              style={styles.input}
              testID="input-b"
            />
            {controls}
            <Pressable
              style={styles.button}
              testID="close-modal"
              onPress={() => {
                record("close", {});
                setVisible(false);
              }}
            >
              <Text>Close B</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function App() {
  return (
    <KeyboardProvider>
      <Repro />
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "white" },
  title: { fontSize: 19, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#64748b",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  row: { flexDirection: "row", gap: 8, marginVertical: 6 },
  button: { backgroundColor: "#e2e8f0", padding: 12, borderRadius: 6 },
  selected: { backgroundColor: "#93c5fd" },
  state: { fontFamily: "monospace", fontSize: 14, marginVertical: 10 },
  backdrop: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: "#0006" },
  modal: { backgroundColor: "white", borderRadius: 12, padding: 16 },
});
