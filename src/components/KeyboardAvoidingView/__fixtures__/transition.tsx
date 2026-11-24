import { fireEvent, screen } from "@testing-library/react-native";
import React, { Suspense, useContext } from "react";
import { Animated } from "react-native";
import { runOnJS, useSharedValue } from "react-native-reanimated";

import { KeyboardProvider } from "../../../animated";
import { KeyboardContext } from "../../../context";
import { useKeyboardHandler } from "../../../hooks";
import {
  useAnimatedKeyboardHandler,
  useAnimatedStyle,
} from "../../../reanimated";
import KeyboardAvoidingView from "../index";

import type { KeyboardAnimationContext } from "../../../context";
import type { NativeEvent } from "../../../types";
import type { KeyboardAvoidingViewProps } from "../index";

type Frame = NativeEvent & { eventName: string };
const listeners = new Set<(event: Frame) => void>();
const registrations: (() => void)[] = [];
const snapshots: (() => void)[] = [];
let mockQueuedWrites: (() => void)[] | undefined;

jest.mock("../../../bindings", () =>
  jest.requireActual("../../../bindings.ts"),
);
jest.mock("react-native-is-edge-to-edge", () => ({
  controlEdgeToEdgeValues: jest.fn(),
  isEdgeToEdge: () => false,
}));
jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  useEvent: (handler: unknown) => handler,
  useHandler: () => ({
    context: require("react").useRef({}).current,
    doDependenciesDiffer: false,
  }),
  interpolate: jest.requireActual("react-native-reanimated/src/interpolation")
    .interpolate,
  useSharedValue: (initial: unknown) =>
    require("react").useState(() => {
      let current = initial;

      return {
        get value() {
          return current;
        },
        set value(next) {
          if (mockQueuedWrites) {
            mockQueuedWrites.push(() => {
              current = next;
            });
          } else {
            current = next;
          }
        },
      };
    })[0],
}));
jest.mock("../../../reanimated", () => ({
  ...jest.requireActual("../../../reanimated.ts"),
  useAnimatedKeyboardHandler: jest.fn(),
  useAnimatedStyle: jest.fn(() => ({})),
  useDerivedValue: (read: () => unknown) => ({
    get value() {
      return read();
    },
  }),
}));
jest.mock("../../../hooks", () => ({
  ...jest.requireActual("../../../hooks"),
  useWindowDimensions: () => ({ width: 400, height: 800 }),
}));

const setKeyboardHandlers: KeyboardAnimationContext["setKeyboardHandlers"] = (
  handler,
  sync,
) => {
  const listener = handler as unknown as (event: Frame) => void;

  registrations.push(() => {
    listeners.add(listener);

    if (sync) {
      snapshots.push(sync);
    }
  });

  return () => {
    listeners.delete(listener);
  };
};

const Registration = ({ children }: React.PropsWithChildren) => {
  const context = useContext(KeyboardContext);

  return (
    <KeyboardContext.Provider value={{ ...context, setKeyboardHandlers }}>
      {children}
    </KeyboardContext.Provider>
  );
};

const suspended = new Promise(() => {});

const Screen = ({
  children,
  hidden,
}: React.PropsWithChildren<{ hidden: boolean }>) => {
  if (hidden) {
    throw suspended;
  }

  return <>{children}</>;
};

const app = (
  behavior?: KeyboardAvoidingViewProps["behavior"],
  hidden = false,
  client?: React.ReactNode,
) => (
  <KeyboardProvider preload={false}>
    <Registration>
      <Suspense fallback={null}>
        <Screen hidden={hidden}>
          {behavior && (
            <KeyboardAvoidingView behavior={behavior} testID="view" />
          )}
          {client}
        </Screen>
      </Suspense>
    </Registration>
  </KeyboardProvider>
);

const flush = (queue: (() => void)[]) =>
  queue.splice(0).forEach((work) => work());
const move = (
  name:
    | "onKeyboardMoveStart"
    | "onKeyboardMove"
    | "onKeyboardMoveInteractive"
    | "onKeyboardMoveEnd",
  height: number,
  progress: number,
) => {
  const [handlers] = jest.mocked(useAnimatedKeyboardHandler).mock.lastCall!;
  const event = { height, progress, duration: 250, target: 1 };

  handlers[name]!(event, {});
  listeners.forEach((listener) => listener({ ...event, eventName: name }));
};
const layout = (height = 800, testID = "view") =>
  fireEvent(screen.getByTestId(testID), "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width: 400, height } },
  });
const readStyle = () => jest.mocked(useAnimatedStyle).mock.lastCall![0];
const style = () => readStyle()();
const queuedMountWrites = (mount: () => void) => {
  const writes: (() => void)[] = [];

  mockQueuedWrites = writes;

  try {
    mount();
  } finally {
    mockQueuedWrites = undefined;
  }

  return writes;
};

beforeEach(() => {
  jest.spyOn(Animated, "event").mockReturnValue(jest.fn());
});
afterEach(() => {
  jest.restoreAllMocks();
  listeners.clear();
  registrations.length = 0;
  snapshots.length = 0;
  mockQueuedWrites = undefined;
});

const Client = ({
  report,
}: {
  report: (revision: number, height: number, progress: number) => void;
}) => {
  const revision = useSharedValue(0);
  const { reanimated } = useContext(KeyboardContext);

  useKeyboardHandler(
    {
      onMove: () => {
        "worklet";
        // eslint-disable-next-line react-compiler/react-compiler
        revision.value += 1;
      },
    },
    [],
    () => {
      const baseline = revision.value;

      return () => {
        "worklet";
        runOnJS(report)(
          baseline,
          -reanimated.height.value,
          reanimated.progress.value,
        );
      };
    },
  );

  return null;
};

export {
  Client,
  app,
  flush,
  layout,
  listeners,
  move,
  queuedMountWrites,
  readStyle,
  registrations,
  snapshots,
  style,
};
