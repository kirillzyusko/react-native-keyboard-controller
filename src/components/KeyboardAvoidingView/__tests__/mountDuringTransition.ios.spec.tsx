import { render, screen } from "@testing-library/react-native";
import React from "react";

import {
  app,
  flush,
  layout,
  move,
  readStyle,
  registrations,
  snapshots,
  style,
} from "../__fixtures__/transition";
import KeyboardAvoidingView from "../index";

const attachSecondView = () => {
  screen.rerender(
    app(
      "padding",
      false,
      <KeyboardAvoidingView behavior="padding" testID="late" />,
    ),
  );
  layout(800, "late");
  flush(registrations);
};

it("keeps the first opening frame in step with an already subscribed view", () => {
  render(app("padding"));
  layout();
  flush(registrations);
  flush(snapshots);
  const control = readStyle();

  attachSecondView();
  move("onKeyboardMoveStart", 300, 1);
  expect(control()).toEqual({ paddingBottom: 0 });
  expect(style()).toEqual(control());

  flush(snapshots);
  expect(style()).toEqual(control());
  move("onKeyboardMove", 150, 0.5);
  expect(control()).toEqual({ paddingBottom: 150 });
  expect(style()).toEqual(control());
});

it("matches the next opening frame after missing both onStart and an earlier move", () => {
  render(app("padding"));
  layout();
  flush(registrations);
  flush(snapshots);
  const control = readStyle();

  move("onKeyboardMoveStart", 300, 1);
  move("onKeyboardMove", 150, 0.5);
  attachSecondView();
  flush(snapshots);

  move("onKeyboardMove", 225, 0.75);
  expect(control()).toEqual({ paddingBottom: 225 });
  expect(style()).toEqual(control());
});

it("follows the closing animation when subscribed after the provider published its zero target", () => {
  render(app());
  move("onKeyboardMoveStart", 300, 1);
  move("onKeyboardMoveEnd", 300, 1);
  move("onKeyboardMoveStart", 0, 0);
  screen.rerender(app("height"));
  layout();
  flush(registrations);
  flush(snapshots);

  move("onKeyboardMove", 150, 0.5);
  expect(style()).toEqual({ height: 650, flex: 0 });
});
