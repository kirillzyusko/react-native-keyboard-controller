import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardAvoidingView,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import { runOnJS } from "react-native-reanimated";

import styles from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";
import type { ListRenderItem } from "react-native";

type Props = StackScreenProps<ExamplesStackParamList>;

type Entry = {
  kind: "onStart" | "onMove" | "onInteractive" | "onEnd";
  at: number;
  height: number;
  progress: number;
  duration: number;
};

/**
 * One completed hide. Deliberately NOT auto-classified: there is no reliable
 * reference from JS for where the keyboard actually was, so the verdict is
 * whatever the person watching the footer says it was.
 */
type Hide = {
  /** How many `onStart` iOS posted for this single hide. */
  starts: number;
  moves: number;
  interactive: number;
  /** Highest and lowest progress seen while the keyboard travelled down. */
  maxProgress: number;
  minProgress: number;
  /** ms from the hide's first onStart until progress first reached ~0. */
  tZero: number | null;
  /** ms from the hide's first onStart until onEnd landed. */
  tEnd: number | null;
  /** Duration iOS reported for the hide, in ms. */
  duration: number;
  verdict: "?" | "ok" | "bug";
};

const ROWS = Array.from({ length: 40 }, (_, index) => `message ${index + 1}`);

function summarizeHide(entries: Entry[]): Hide | null {
  // Anchor on the FIRST hide-start after the last show-start: iOS posts
  // `willHide` more than once for a single dismissal, and anchoring on the last
  // one would drop every movement event that arrived in between.
  const lastShow = entries.reduce(
    (last, entry, index) =>
      entry.kind === "onStart" && entry.progress === 1 ? index : last,
    -1,
  );
  const hideStart = entries.findIndex(
    (entry, index) =>
      index > lastShow && entry.kind === "onStart" && entry.progress === 0,
  );

  if (hideStart === -1) {
    return null;
  }

  const start = entries[hideStart].at;
  const hide = entries.slice(hideStart);
  const movements = hide.filter(
    (entry) => entry.kind === "onMove" || entry.kind === "onInteractive",
  );
  const progresses = movements.map((entry) => entry.progress);
  const zero = movements.find((entry) => entry.progress <= 0.02);
  const end = hide.find((entry) => entry.kind === "onEnd");

  return {
    starts: hide.filter((entry) => entry.kind === "onStart").length,
    moves: movements.filter((entry) => entry.kind === "onMove").length,
    interactive: movements.filter((entry) => entry.kind === "onInteractive")
      .length,
    maxProgress: progresses.length ? Math.max(...progresses) : Number.NaN,
    minProgress: progresses.length ? Math.min(...progresses) : Number.NaN,
    tZero: zero ? zero.at - start : null,
    tEnd: end ? end.at - start : null,
    duration: entries[hideStart].duration,
    verdict: "?",
  };
}

const renderRow: ListRenderItem<string> = ({ item }) => (
  <View style={styles.row}>
    <Text>{item}</Text>
  </View>
);

export default function StaleAnimationRepro({ navigation }: Props) {
  const buffer = useRef<Entry[]>([]);

  const [inverted, setInverted] = useState(true);
  const [history, setHistory] = useState<Hide[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.header}
          testID="stale_animation.inverted"
          onPress={() => setInverted((value) => !value)}
        >
          {inverted ? "inverted" : "regular"}
        </Text>
      ),
    });
  }, [inverted]);

  // Accumulate into a ref rather than state: re-rendering on every frame of the
  // keyboard animation would perturb the very timing this repro depends on.
  const record = useCallback(
    (
      kind: Entry["kind"],
      at: number,
      height: number,
      progress: number,
      duration: number,
    ) => {
      buffer.current.push({ kind, at, height, progress, duration });

      if (kind === "onEnd") {
        const hide = summarizeHide([...buffer.current]);

        buffer.current = [];

        if (hide !== null) {
          setHistory((prev) => [hide, ...prev].slice(0, 6));
        }
      }
    },
    [],
  );

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        runOnJS(record)(
          "onStart",
          Date.now(),
          e.height,
          e.progress,
          e.duration,
        );
      },
      onMove: (e) => {
        "worklet";

        runOnJS(record)("onMove", Date.now(), e.height, e.progress, e.duration);
      },
      onInteractive: (e) => {
        "worklet";

        runOnJS(record)(
          "onInteractive",
          Date.now(),
          e.height,
          e.progress,
          e.duration,
        );
      },
      onEnd: (e) => {
        "worklet";

        runOnJS(record)("onEnd", Date.now(), e.height, e.progress, e.duration);
      },
    },
    [record],
  );

  const label = useCallback((verdict: "ok" | "bug") => {
    setHistory((prev) =>
      prev.map((hide, index) => (index === 0 ? { ...hide, verdict } : hide)),
    );
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      testID="stale_animation.container"
    >
      <FlatList
        data={ROWS}
        inverted={inverted}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        renderItem={renderRow}
        style={styles.list}
      />

      <View style={styles.panel}>
        <Text style={styles.hint}>
          Tap the input, flick the list to dismiss, then tag what you SAW on the
          newest row. Newest first.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonOk]}
            testID="stale_animation.mark_ok"
            onPress={() => label("ok")}
          >
            <Text style={styles.buttonLabel}>looked ok</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonBug]}
            testID="stale_animation.mark_bug"
            onPress={() => label("bug")}
          >
            <Text style={styles.buttonLabel}>looked wrong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            testID="stale_animation.reset"
            onPress={() => {
              buffer.current = [];
              setHistory([]);
            }}
          >
            <Text style={styles.buttonLabel}>clear</Text>
          </TouchableOpacity>
        </View>

        {history.map((hide, index) => (
          <View
            key={index}
            style={[
              styles.verdict,
              hide.verdict === "ok" && styles.verdictGood,
              hide.verdict === "bug" && styles.verdictBad,
            ]}
          >
            <Text style={styles.verdictDetail}>
              [{hide.verdict}] starts={hide.starts} move={hide.moves}{" "}
              interactive={hide.interactive}
            </Text>
            <Text style={styles.verdictDetail}>
              p {hide.maxProgress.toFixed(3)}-&gt;{hide.minProgress.toFixed(3)}{" "}
              p0@{hide.tZero === null ? "never" : `${hide.tZero}ms`} end@
              {hide.tEnd === null ? "never" : `${hide.tEnd}ms`} iosDur=
              {hide.duration}
            </Text>
          </View>
        ))}
      </View>

      {/* This is what must follow the keyboard down. */}
      <View style={styles.footer}>
        <TextInput
          placeholder="tap here, then flick the list"
          placeholderTextColor="#7C7C7C"
          style={styles.input}
          testID="stale_animation.input"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
