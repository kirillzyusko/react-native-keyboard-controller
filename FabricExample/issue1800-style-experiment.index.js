/* global globalThis */
import React, { useEffect, useRef, useState } from "react";
import { AppRegistry, Text, TextInput, View } from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardController,
  KeyboardProvider,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { name } from "./app.json";

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const measure = (ref) =>
  new Promise((resolve) =>
    ref.current.measureInWindow((x, y, w, h) => resolve({ y, h })),
  );

function Target({ value, kind, save }) {
  const animated = useAnimatedStyle(() => ({ height: value.value }));
  const Component =
    kind === "reference" ? Reanimated.View : KeyboardAvoidingView;
  const style =
    kind === "staticAndAnimatedHeight" ? [{ height: 640 }, animated] : animated;

  return (
    <View style={{ flex: 1 }}>
      <Component ref={save} behavior="height" collapsable={false} style={style}>
        <View style={{ flex: 1, backgroundColor: "#abe" }} />
      </Component>
    </View>
  );
}

function App() {
  const value = useSharedValue(600);
  const { height, progress } = useReanimatedKeyboardAnimation();
  const field = useRef(null);
  const kinds = ["reference", "animatedHeight", "staticAndAnimatedHeight"];
  const [refs] = useState(() => kinds.map(() => React.createRef()));
  const [phase, setPhase] = useState("starting");

  useEffect(() => {
    let alive = true;
    const trace = [];

    async function sample(label) {
      await pause(400);

      if (!alive) {
        return;
      }
      const frames = await Promise.all(refs.map(measure));

      trace.push({
        label,
        progress: progress.value,
        height: height.value,
        frames: Object.fromEntries(kinds.map((k, i) => [k, frames[i]])),
      });
      globalThis.issue1800style = trace;
    }

    async function until(p) {
      for (let i = 0; i < 80; i++) {
        if (progress.value === p) {
          return;
        }
        await pause(50);
      }

      throw Error("Timed out waiting for " + p);
    }

    async function run() {
      await sample("initial closed 600");
      // eslint-disable-next-line react-compiler/react-compiler
      value.value = 665;
      await sample("updated closed 665");
      field.current.focus();
      await until(1);
      await sample("open 665");
      await KeyboardController.dismiss();
      await until(0);
      await sample("closed 665");
      value.value = 645;
      await sample("updated closed 645");
      const same = (a, b) => Math.abs(a - b) < 1;
      const passed = trace.every(({ label, frames }) =>
        label.startsWith("open")
          ? frames.animatedHeight.h > 0 &&
            frames.animatedHeight.h < frames.reference.h &&
            same(frames.animatedHeight.h, frames.staticAndAnimatedHeight.h)
          : same(frames.reference.h, frames.animatedHeight.h) &&
            same(frames.reference.h, frames.staticAndAnimatedHeight.h),
      );

      if (alive) {
        setPhase(passed ? "PASS" : "FAIL");
      }
    }
    run().catch((e) => setPhase(String(e)));

    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 70 }}>
      <TextInput ref={field} placeholder="Keyboard target" />
      <Text>{phase}</Text>
      <View style={{ flexDirection: "row", flex: 1 }}>
        {kinds.map((k, i) => (
          <Target key={k} kind={k} save={refs[i]} value={value} />
        ))}
      </View>
    </View>
  );
}
AppRegistry.registerComponent(name, () => () => (
  <KeyboardProvider preload={false}>
    <App />
  </KeyboardProvider>
));
