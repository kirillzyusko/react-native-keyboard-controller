/* global globalThis */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, TextInput, View } from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardContext,
  useKeyboardContext,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import { runOnJS, runOnUI, useSharedValue } from "react-native-reanimated";

import { useKeyboardAnimation } from "../src/components/KeyboardAvoidingView/hooks";

const fill = { flex: 1 };
let nextListenerId = -180000;
const measure = (ref) =>
  new Promise((resolve) =>
    ref.current.measureInWindow((_x, y, _width, height) =>
      resolve({ y, height }),
    ),
  );

// Forward the real handler immediately. Delay only its initial snapshot until a
// genuine Android IME frame, after onStart has supplied the opening target.
function MidMoveSnapshot({ children, probe = false, phase, notifyArmed }) {
  const context = useKeyboardContext();
  const value = useMemo(() => {
    const { height, progress } = context.reanimated;

    return {
      ...context,
      setKeyboardHandlers(handler, sync) {
        if (!sync) {
          return context.setKeyboardHandlers(handler);
        }
        const id = nextListenerId--;
        const unsubscribe = context.setKeyboardHandlers(handler, () => {
          "worklet";
          height.addListener(id, (h) => {
            if (h >= 0 || progress.value < 0.15 || progress.value > 0.9) {
              return;
            }
            height.removeListener(id);

            if (probe) {
              phase.value = 1;
            }
            sync();

            if (probe) {
              phase.value = 2;
            }
          });

          if (probe) {
            runOnJS(notifyArmed)();
          }
        });

        return () => {
          unsubscribe();
          runOnUI(() => {
            "worklet";
            height.removeListener(id);
          })();
        };
      },
    };
  }, [context, notifyArmed, phase, probe]);

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
}

function Probe({ phase, target, report }) {
  const { heightWhenOpened } = useKeyboardAnimation();
  const {
    reanimated: { height, progress },
  } = useKeyboardContext();

  useLayoutEffect(() => {
    const id = nextListenerId--;

    runOnUI(() => {
      "worklet";
      phase.addListener(id, (step) => {
        runOnJS(report)(step === 1 ? "before" : "after", {
          target: target.value,
          heightWhenOpened: heightWhenOpened.value,
          height: -height.value,
          progress: progress.value,
        });
      });
    })();

    return () => {
      runOnUI(() => {
        "worklet";
        phase.removeListener(id);
      })();
    };
  }, [height, heightWhenOpened, phase, progress, report, target]);

  return null;
}

export default function StartBeforeSync() {
  const input = useRef(null);
  const subject = useRef(null);
  const control = useRef(null);
  const trace = useRef({}).current;
  const [armed, setArmed] = useState(false);
  const [ended, setEnded] = useState(false);
  const [result, setResult] = useState(null);
  const target = useSharedValue(0);
  const phase = useSharedValue(0);
  const notifyArmed = useCallback(() => setArmed(true), []);
  const report = useCallback(
    (label, sample) => {
      trace[label] = sample;
      console.log(
        "[issue1800] start-before-sync",
        label,
        JSON.stringify(sample),
      );
    },
    [trace],
  );
  const didEnd = useCallback(() => setEnded(true), []);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        if (e.height > 0) {
          // eslint-disable-next-line react-compiler/react-compiler
          target.value = e.height;
          runOnJS(report)("start", { height: e.height, progress: e.progress });
        }
      },
      onEnd: (e) => {
        "worklet";

        if (e.height > 0 && e.progress === 1) {
          runOnJS(report)("end", { height: e.height, progress: e.progress });
          runOnJS(didEnd)();
        }
      },
    },
    [],
  );

  useEffect(() => {
    if (armed) {
      const timer = setTimeout(() => input.current?.focus(), 500);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [armed]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(
      async () => {
        const [reference, delayed] = await Promise.all([
          measure(control),
          measure(subject),
        ]);

        if (!active) {
          return;
        }
        const { before, after } = trace;
        const reached =
          ended &&
          before &&
          after &&
          before.target > before.height &&
          before.height > 0 &&
          before.heightWhenOpened === before.target;
        const same =
          reached &&
          after.heightWhenOpened === before.target &&
          Math.abs(reference.height - delayed.height) < 1;
        let verdict = "INCONCLUSIVE";

        if (reached) {
          verdict = same ? "PASS" : "FAIL";
        }
        const outcome = { ...trace, reference, delayed, verdict };

        globalThis.issue1800.startBeforeSync = outcome;
        console.log(
          "[issue1800] start-before-sync settled",
          JSON.stringify(outcome),
        );
        setResult(outcome);
      },
      ended ? 350 : 30000,
    );

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [ended, trace]);

  const panel = (ref, label) => (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={120}
      style={fill}
    >
      <View
        ref={ref}
        collapsable={false}
        style={{ flex: 1, backgroundColor: "#dff4ed" }}
      >
        <Text>{label}</Text>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={fill}>
      <TextInput ref={input} placeholder="Keyboard target" />
      <Text
        testID={result ? "issue1800-start-complete" : "issue1800-start-status"}
      >
        {result?.verdict ??
          (armed
            ? "Waiting for opening animation"
            : "Waiting for UI registration")}
      </Text>
      {result && (
        <Text>{`Target ${result.start?.height}, snapshot ${result.before?.height}, local ${result.before?.heightWhenOpened} → ${result.after?.heightWhenOpened}`}</Text>
      )}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {panel(control, "Reference")}
        <MidMoveSnapshot notifyArmed={notifyArmed} phase={phase}>
          {panel(subject, "Delayed snapshot")}
        </MidMoveSnapshot>
      </View>
      <MidMoveSnapshot probe notifyArmed={notifyArmed} phase={phase}>
        <Probe phase={phase} report={report} target={target} />
      </MidMoveSnapshot>
    </View>
  );
}
