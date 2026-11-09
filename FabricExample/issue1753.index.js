// cspell:words Pressable
import React, { useRef, useState } from "react";
import {
  AppRegistry,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from "react-native-keyboard-controller";

import { name as appName } from "./app.json";

const trace = [];

global.issue1753Trace = trace;
const log = (event, data) => {
  const entry = { time: Date.now(), event, ...data };

  trace.push(entry);
  console.log("[issue1753]", JSON.stringify(entry));
};

function Action({ id, children, onPress }) {
  return (
    <Pressable
      style={{ padding: 12, backgroundColor: "#e4edfa", borderRadius: 6 }}
      testID={id}
      onPress={onPress}
    >
      <Text style={{ color: "#13233b" }}>{children}</Text>
    </Pressable>
  );
}

// The issue's Repro, with stable selectors, event logging and an offset-only control.
function Repro({ label, onClose, onOpenModal, scrollOnClear = true }) {
  const prefix = label === "overlay" ? "issue1753-overlay" : "issue1753";
  const [empty, setEmpty] = useState(false);
  const [y, setY] = useState(0);
  const [before, setBefore] = useState(null);
  const scroll = useRef(null);
  const at = useRef(0);
  const changed = useRef(false);
  const instruction = scrollOnClear
    ? "Focus Last, then delete X"
    : "Control: delete X, no scrollTo";

  return (
    <View
      style={{ flex: 1, paddingTop: 40, backgroundColor: "white" }}
      testID={`issue1753-${label}-screen`}
    >
      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 8 }}>
        <Action id={`${prefix}-close`} onPress={onClose}>
          Back
        </Action>
        {onOpenModal && (
          <Action id="issue1753-open-over-screen" onPress={onOpenModal}>
            Open Modal
          </Action>
        )}
      </View>
      <Text style={{ padding: 8, fontSize: 18 }} testID={`${prefix}-status`}>
        {label} bottomOffset {empty ? 60 : 20} y {y}
      </Text>
      <Text style={{ paddingHorizontal: 8 }} testID={`${prefix}-result`}>
        {before === null
          ? instruction
          : `before ${Math.round(before)} expected ${Math.round(
              before + 40,
            )} final ${y}`}
      </Text>
      <KeyboardAwareScrollView
        ref={scroll}
        bottomOffset={empty ? 60 : 20}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        scrollEventThrottle={16}
        testID={`${prefix}-scroll`}
        onScroll={(e) => {
          at.current = e.nativeEvent.contentOffset.y;
          setY(Math.round(at.current));
          log("scroll", { label, y: at.current, changed: changed.current });
        }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <TextInput
            key={i}
            accessibilityLabel={`Field ${i + 1}`}
            style={{ height: 48, borderWidth: 1 }}
            testID={`${prefix}-input-${i}`}
          />
        ))}
        <TextInput
          accessibilityLabel="Last"
          defaultValue="X"
          placeholder="Last"
          style={{ height: 48, borderWidth: 1 }}
          testID={`${prefix}-last`}
          onChangeText={(t) => {
            if (t === "") {
              changed.current = true;
              setBefore(at.current);

              if (scrollOnClear) {
                log("app-scroll-request", {
                  label,
                  before: at.current,
                  target: at.current + 40,
                });
                scroll.current?.scrollTo({
                  y: at.current + 40,
                  animated: false,
                });
              } else {
                log("offset-only", {
                  label,
                  before: at.current,
                  trigger: "clearText",
                });
              }
            }
            log("changeText", {
              label,
              text: t,
              bottomOffset: t === "" ? 60 : 20,
            });
            setEmpty(t === "");
          }}
          onFocus={() => log("focus", { label, y: at.current })}
        />
        <View style={{ height: 300 }} />
      </KeyboardAwareScrollView>
    </View>
  );
}

function App() {
  const [mode, setMode] = useState(null);
  const [overlay, setOverlay] = useState(false);
  const close = () => {
    Keyboard.dismiss();

    if (overlay) {
      log("close-overlay", {});
      setOverlay(false);
    } else {
      setMode(null);
    }
  };

  return (
    <KeyboardProvider>
      {mode === "screen" ? (
        <Repro
          label="screen"
          onClose={close}
          onOpenModal={() => {
            log("open-overlay", {});
            setOverlay(true);
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            padding: 24,
            paddingTop: 80,
            gap: 16,
            backgroundColor: "white",
          }}
          testID="issue1753-menu"
        >
          <Text style={{ fontSize: 22, color: "#13233b" }}>
            Issue 1753 — bottomOffset
          </Text>
          <Text style={{ color: "#13233b" }}>
            Compare deleting X inside and outside Modal.
          </Text>
          <Action
            id="issue1753-open-screen"
            onPress={() => {
              log("open", { label: "screen" });
              setMode("screen");
            }}
          >
            Screen
          </Action>
          <Action
            id="issue1753-open-modal"
            onPress={() => {
              log("open", { label: "modal" });
              setMode("modal");
            }}
          >
            Modal
          </Action>
          <Action
            id="issue1753-open-modal-offset-only"
            onPress={() => {
              log("open", { label: "modal-offset-only" });
              setMode("modal-offset-only");
            }}
          >
            Modal: offset only
          </Action>
        </View>
      )}
      <Modal
        animationType="none"
        visible={overlay || mode === "modal" || mode === "modal-offset-only"}
        onRequestClose={close}
      >
        <Repro
          label={overlay ? "overlay" : "modal"}
          scrollOnClear={mode !== "modal-offset-only"}
          onClose={close}
        />
      </Modal>
    </KeyboardProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
