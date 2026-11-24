/* global globalThis */
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Text, TextInput, View } from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardController,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";

const never = new Promise(() => {});
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const modes = ["height", "translate-with-padding"];
const fill = { flex: 1 };
const row = { flex: 1, flexDirection: "row" };
const inspect = (ref) =>
  new Promise((resolve) =>
    ref.current.measureInWindow((_x, y, _w, h) => resolve({ y, h })),
  );

function Pair({ hidden, save, lifecycle }) {
  const [identity] = useState(() => Math.random());

  useLayoutEffect(() => {
    lifecycle?.push(["visible", identity]);

    return () => {
      lifecycle?.push(["hidden", identity]);
    };
  }, [identity, lifecycle]);

  if (hidden) {
    throw never;
  }

  return (
    <View style={row}>
      {modes.map((mode, i) => (
        <View key={mode} style={fill}>
          <KeyboardAvoidingView behavior={mode} style={fill}>
            <View
              ref={save[i]}
              collapsable={false}
              style={{
                flex: 1,
                backgroundColor: i ? "#e1f6ed" : "#e2ecff",
                justifyContent: "flex-end",
              }}
            >
              <Text>{i ? "Translate" : "Height"}</Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      ))}
    </View>
  );
}

export default function Regression() {
  const { progress, height } = useReanimatedKeyboardAnimation();
  const field = useRef(null);
  const [control] = useState(() => modes.map(() => React.createRef()));
  const [subject] = useState(() => modes.map(() => React.createRef()));
  const lifecycle = useRef([]).current;
  const [hidden, setHidden] = useState(false);
  const [status, setStatus] = useState("Checking autofocus…");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    const samples = [];

    async function waitFor(check, why) {
      for (let i = 0; i < 60; i++) {
        if (!active) {
          throw new Error("Unmounted");
        }
        if (check()) {
          return;
        }
        await delay(100);
      }

      throw new Error("Timeout: " + why);
    }

    async function sample(name, open) {
      await waitFor(
        () =>
          progress.value === (open ? 1 : 0) &&
          subject.every((ref) => ref.current),
        name,
      );
      await delay(400);
      const [c0, c1, s0, s1] = await Promise.all(
        [...control, ...subject].map(inspect),
      );

      samples.push({
        name,
        progress: progress.value,
        height: height.value,
        control: [c0, c1],
        subject: [s0, s1],
      });
    }

    async function freeze(change, open) {
      let count = lifecycle.length;

      setHidden(true);
      await waitFor(
        () => lifecycle.length > count && lifecycle.at(-1)[0] === "hidden",
        "suspend",
      );
      change();
      await waitFor(
        () => progress.value === (open ? 1 : 0),
        "change keyboard while suspended",
      );
      await delay(450);
      count = lifecycle.length;
      setHidden(false);
      await waitFor(
        () => lifecycle.length > count && lifecycle.at(-1)[0] === "visible",
        "resume",
      );
    }

    async function run() {
      try {
        await sample("autofocus", true);
        await freeze(() => {
          void KeyboardController.dismiss();
        }, false);
        await sample("resumed closed", false);
        await freeze(() => field.current.focus(), true);
        await sample("resumed open", true);
        await KeyboardController.dismiss();
        await sample("closed while visible", false);
        const same = samples.every((a) =>
          a.control.every(
            (c, i) =>
              Math.abs(c.h - a.subject[i].h) < 1 &&
              Math.abs(c.y - a.subject[i].y) < 1,
          ),
        );
        const restored = modes.every(
          (_mode, i) => samples[3].subject[i].h - samples[0].subject[i].h > 40,
        );
        const preserved = new Set(lifecycle.map((item) => item[1])).size === 1;
        const result = {
          samples,
          lifecycle: [...lifecycle],
          same,
          restored,
          preserved,
        };

        globalThis.issue1800.regression = result;
        console.log("[issue1800] regression", JSON.stringify(result));
        setStatus(same && restored && preserved ? "PASS" : "FAIL");
      } catch (e) {
        if (active) {
          setStatus(String(e));
        }
      }

      if (active) {
        setDone(true);
      }
    }
    run();

    return () => {
      active = false;
    };
  }, [control, height, lifecycle, progress, subject]);

  return (
    <View style={fill}>
      <Text testID="issue1800-regression-screen">Suspense and autofocus</Text>
      <TextInput
        ref={field}
        autoFocus
        placeholder="Focus target"
        testID="issue1800-autofocus"
      />
      <Text
        testID={
          done ? "issue1800-regression-complete" : "issue1800-regression-status"
        }
      >
        {status}
      </Text>
      <View style={row}>
        <Pair save={control} />
        <Suspense
          fallback={
            <View style={fill}>
              <Text>Content suspended</Text>
            </View>
          }
        >
          <Pair hidden={hidden} lifecycle={lifecycle} save={subject} />
        </Suspense>
      </View>
    </View>
  );
}
