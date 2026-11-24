/* global globalThis */
/* eslint-disable react-compiler/react-compiler -- The probes compare fixed hook implementations and record their values on the UI runtime. */
import React, {
  Suspense,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppRegistry, Text, TextInput, View } from "react-native";
import {
  KeyboardContext,
  KeyboardController,
  KeyboardProvider,
  useKeyboardContext,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import { runOnJS, runOnUI } from "react-native-reanimated";

import { useKeyboardAnimation as useCurrent } from "../src/components/KeyboardAvoidingView/hooks";

import { name } from "./app.json";
import { useKeyboardAnimation as useBefore } from "./issue1800.ios-before";

const never = new Promise(() => {});

function Probe({ kind, useAnimation }) {
  const state = useAnimation();

  useLayoutEffect(() => {
    runOnUI(() => {
      "worklet";
      globalThis.__iosStart1800 ||= { data: {}, sync: {} };
      globalThis.__iosStart1800.data[kind] = state;
    })();
  }, []);

  return null;
}

function HoldSnapshot({ kind, children, ready }) {
  const context = useKeyboardContext();
  const value = useMemo(
    () => ({
      ...context,
      setKeyboardHandlers(handler, sync) {
        return context.setKeyboardHandlers(handler, () => {
          "worklet";
          globalThis.__iosStart1800 ||= { data: {}, sync: {} };
          globalThis.__iosStart1800.sync[kind] = sync;
          runOnJS(ready)(kind);
        });
      },
    }),
    [context, kind, ready],
  );

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
}

function read(state) {
  "worklet";

  return {
    progress: state.progress.value,
    height: state.height.value,
    target: state.heightWhenOpened.value,
    isClosed: state.isClosed.value,
  };
}

// Reanimated may invoke this observer before the provider and measured KAVs in
// the same native dispatch. Queue a separate UI job and count every real move
// so the comparison is only valid when no frame reached the listeners yet.
function flushAfterNativeDispatch() {
  runOnUI(() => {
    "worklet";
    globalThis.__iosStart1800.capture?.();
  })();
}

function Observe({ start, ended, frame }) {
  const { reanimated } = useKeyboardContext();

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";
        const { data, sync } = globalThis.__iosStart1800;

        if (
          !sync.before ||
          !sync.after ||
          !data.before ||
          !data.after ||
          !data.reference
        ) {
          return;
        }
        globalThis.__iosStart1800.lastDestination = e.progress;
        globalThis.__iosStart1800.moves = 0;
        globalThis.__iosStart1800.capture = () => {
          const before = {
            reference: read(data.reference),
            old: read(data.before),
            current: read(data.after),
          };

          sync.before();
          sync.after();
          const after = {
            reference: read(data.reference),
            old: read(data.before),
            current: read(data.after),
          };

          runOnJS(start)({
            moves: globalThis.__iosStart1800.moves,
            event: { height: e.height, progress: e.progress },
            provider: {
              height: -reanimated.height.value,
              progress: reanimated.progress.value,
            },
            before,
            after,
          });
        };
        runOnJS(flushAfterNativeDispatch)();
      },
      onMove: (e) => {
        "worklet";
        const board = globalThis.__iosStart1800;

        if (!board) {
          return;
        }
        board.moves += 1;

        if (!board.first || board.lastDestination !== board.first.destination) {
          board.first = { destination: board.lastDestination };
          runOnJS(frame)({ height: e.height, progress: e.progress });
        }
      },
      onEnd: (e) => {
        "worklet";
        runOnJS(ended)(e.progress);
      },
    },
    [],
  );

  return null;
}

function Subjects({ hidden, ready, start, ended, frame }) {
  if (hidden) {
    throw never;
  }

  return (
    <>
      <HoldSnapshot kind="before" ready={ready}>
        <Probe kind="before" useAnimation={useBefore} />
      </HoldSnapshot>
      <HoldSnapshot kind="after" ready={ready}>
        <Probe kind="after" useAnimation={useCurrent} />
      </HoldSnapshot>
      <Observe ended={ended} frame={frame} start={start} />
    </>
  );
}

function Screen() {
  const field = useRef(null),
    armed = useRef(new Set()),
    mode = useRef("opening"),
    trace = useRef({}).current;
  const [hidden, setHidden] = useState(false),
    [status, setStatus] = useState("Checking");
  const ready = useCallback((kind) => {
    armed.current.add(kind);

    if (armed.current.size !== 2) {
      return;
    }
    armed.current.clear();
    const action = mode.current;

    setTimeout(() => {
      if (action === "opening") {
        field.current?.focus();
      }
      if (action === "closing") {
        void KeyboardController.dismiss();
      }
    }, 300);
  }, []);
  const start = useCallback(
    (sample) => {
      trace[mode.current] = { ...sample };
      globalThis.issue1800IosStart = trace;
    },
    [trace],
  );
  const frame = useCallback(
    (sample) => {
      if (trace[mode.current] && !trace[mode.current].firstMove) {
        trace[mode.current].firstMove = sample;
      }
    },
    [trace],
  );
  const ended = useCallback(
    (p) => {
      if (mode.current === "opening" && p === 1) {
        mode.current = "closing";
        setHidden(true);
        setTimeout(() => setHidden(false), 450);
      } else if (mode.current === "closing" && p === 0) {
        mode.current = "done";
        const valid = ["opening", "closing"].every((k) => {
          const row = trace[k],
            expected = k === "opening" ? 0 : 1;

          return (
            row &&
            row.moves === 0 &&
            row.firstMove &&
            row.before.reference.progress === expected &&
            row.before.old.progress === expected &&
            row.before.current.progress === expected &&
            row.after.old.progress === 1 - expected &&
            row.after.current.progress === expected &&
            row.after.reference.progress === expected &&
            row.provider.progress === 1 - expected
          );
        });

        setStatus(valid ? "PASS" : "FAIL");
        globalThis.issue1800IosStart = trace;
      }
    },
    [trace],
  );

  return (
    <View style={{ flex: 1, paddingTop: 75 }}>
      <TextInput ref={field} placeholder="Keyboard target" />
      <Text>{status}</Text>
      <Probe kind="reference" useAnimation={useCurrent} />
      <Suspense fallback={<Text>Reattaching subscriptions</Text>}>
        <Subjects
          ended={ended}
          frame={frame}
          hidden={hidden}
          ready={ready}
          start={start}
        />
      </Suspense>
    </View>
  );
}
AppRegistry.registerComponent(name, () => () => (
  <KeyboardProvider preload={false}>
    <Screen />
  </KeyboardProvider>
));
/* eslint-enable react-compiler/react-compiler */
