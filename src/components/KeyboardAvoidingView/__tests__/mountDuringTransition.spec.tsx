import { render, screen } from "@testing-library/react-native";
import React from "react";

import {
  Client,
  app,
  flush,
  layout,
  listeners,
  move,
  queuedMountWrites,
  registrations,
  snapshots,
  style,
} from "../__fixtures__/transition";

jest.mock("react-native/Libraries/Utilities/Platform", () => {
  const ios = jest.requireActual(
    "react-native/Libraries/Utilities/Platform.ios",
  ).default;

  return {
    __esModule: true,
    default: Object.assign(Object.create(ios), { OS: "android" }),
  };
});

it("does not apply a JS snapshot from before the closing events", () => {
  render(app());
  move("onKeyboardMoveEnd", 300, 1);
  const writes = queuedMountWrites(() => screen.rerender(app("padding")));

  layout();
  flush(registrations);
  move("onKeyboardMoveStart", 0, 0);
  move("onKeyboardMoveEnd", 0, 0);
  flush(writes);
  flush(snapshots);
  expect(style()).toEqual({ paddingBottom: 0 });
});

it("removes padding when the keyboard finishes closing before UI registration", () => {
  render(app());
  move("onKeyboardMoveEnd", 300, 1);
  screen.rerender(app("padding"));
  layout();
  move("onKeyboardMoveStart", 0, 0);
  move("onKeyboardMoveEnd", 0, 0);
  flush(registrations);
  flush(snapshots);
  expect(style()).toEqual({ paddingBottom: 0 });
});

it("keeps the target from onStart when the UI snapshot sees an intermediate frame", () => {
  render(app("padding"));
  layout();
  flush(registrations);
  move("onKeyboardMoveStart", 300, 1);
  move("onKeyboardMove", 150, 0.5);
  expect(style()).toEqual({ paddingBottom: 150 });

  flush(snapshots);
  expect(style()).toEqual({ paddingBottom: 150 });
  move("onKeyboardMoveEnd", 300, 1);
  expect(style()).toEqual({ paddingBottom: 300 });
});

it("resizes on the first frame after registration even if onStart was missed", () => {
  render(app("height"));
  layout();
  move("onKeyboardMoveStart", 300, 1);
  flush(registrations);
  move("onKeyboardMove", 150, 0.5);
  flush(snapshots);
  expect(style()).toEqual({ height: 650, flex: 0 });

  move("onKeyboardMoveEnd", 300, 1);
  expect(style()).toEqual({ height: 500, flex: 0 });
});

it("recovers on the first closing frame after a zero snapshot", () => {
  render(app("height"));
  layout();
  move("onKeyboardMoveStart", 0, 0);
  flush(registrations);
  flush(snapshots);

  move("onKeyboardMove", 150, 0.5);
  expect(style()).toEqual({ height: 650, flex: 0 });
  move("onKeyboardMoveEnd", 0, 0);
  expect(style()).toEqual({});
});

it("seeds the opening target when mounting mid-transition and retains it through an interrupted close", () => {
  render(app());
  move("onKeyboardMoveStart", 300, 1);
  move("onKeyboardMove", 150, 0.5);
  screen.rerender(app("padding"));
  layout();
  flush(registrations);
  flush(snapshots);
  expect(style()).toEqual({ paddingBottom: 150 });

  move("onKeyboardMoveEnd", 300, 1);
  move("onKeyboardMoveStart", 0, 0);
  move("onKeyboardMoveEnd", 150, 0.5);
  expect(style()).toEqual({ paddingBottom: 150 });
});

it("preserves the zero padding set by an interactive event before the snapshot", () => {
  render(app("translate-with-padding"));
  layout();
  flush(registrations);
  move("onKeyboardMoveStart", 300, 1);
  move("onKeyboardMoveInteractive", 150, 0.5);
  flush(snapshots);
  expect(style()).toEqual({ paddingTop: 0, transform: [{ translateY: -150 }] });
});

it("restores the full measured height when a suspended view misses the final close frame", () => {
  render(app("height"));
  layout();
  flush(registrations);
  flush(snapshots);
  move("onKeyboardMoveStart", 300, 1);
  move("onKeyboardMoveEnd", 300, 1);
  layout(500);
  expect(style()).toEqual({ height: 500, flex: 0 });

  screen.rerender(app("height", true));
  move("onKeyboardMoveStart", 0, 0);
  move("onKeyboardMoveEnd", 0, 0);
  screen.rerender(app("height"));
  flush(registrations);
  flush(snapshots);
  expect(style()).toEqual({ height: 800, flex: 0 });

  layout(800);
  expect(style()).toEqual({});
});

it("restores both translation and padding after keyboard transitions while suspended", () => {
  render(app("translate-with-padding"));
  layout();
  flush(registrations);
  flush(snapshots);
  move("onKeyboardMoveStart", 300, 1);
  move("onKeyboardMoveEnd", 300, 1);
  expect(style()).toEqual({
    paddingTop: 300,
    transform: [{ translateY: -300 }],
  });

  screen.rerender(app("translate-with-padding", true));
  expect(listeners.size).toBe(0);
  move("onKeyboardMoveEnd", 0, 0);
  screen.rerender(app("translate-with-padding"));
  flush(registrations);
  flush(snapshots);
  expect(style()).toEqual({ paddingTop: 0, transform: [{ translateY: -0 }] });

  screen.rerender(app("translate-with-padding", true));
  move("onKeyboardMoveEnd", 250, 1);
  screen.rerender(app("translate-with-padding"));
  flush(registrations);
  flush(snapshots);
  expect(style()).toEqual({
    paddingTop: 250,
    transform: [{ translateY: -250 }],
  });
});

it("lets a useKeyboardHandler client read current state once per subscription without a native event", () => {
  const report = jest.fn();
  const client = <Client report={report} />;

  render(app());
  move("onKeyboardMoveEnd", 300, 1);
  screen.rerender(app(undefined, false, client));
  flush(registrations);
  expect(report).not.toHaveBeenCalled();
  flush(snapshots);
  expect(report.mock.calls).toEqual([[0, 300, 1]]);

  move("onKeyboardMove", 150, 0.5);
  screen.rerender(app(undefined, true, client));
  move("onKeyboardMoveEnd", 0, 0);
  screen.rerender(app(undefined, false, client));
  flush(registrations);
  flush(snapshots);
  expect(report.mock.calls).toEqual([
    [0, 300, 1],
    [1, 0, 0],
  ]);
});
