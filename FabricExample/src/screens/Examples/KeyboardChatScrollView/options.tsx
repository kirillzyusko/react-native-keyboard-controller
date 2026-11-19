import React from "react";

import ContactTitle from "./components/ContactTitle";
import { type BackSwipeMode, useChatConfigStore } from "./store";

import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const renderContactTitle = () => <ContactTitle />;

const header: NativeStackNavigationOptions = {
  headerTintColor: "#fff",
  headerStyle: {
    backgroundColor: "#3A3A3C",
  },
  headerBackButtonDisplayMode: "minimal",
};

// Every mode lists all keys, so that switching to another mode resets the
// previous one: `undefined` restores the native-stack default (an explicit
// `false` would, for example, disable the iOS 26 content swipe).
export const backSwipeOptions: Record<
  BackSwipeMode,
  NativeStackNavigationOptions
> = {
  dismiss: {
    keyboardHandlingEnabled: true,
    animation: undefined,
    animationMatchesGesture: undefined,
    fullScreenGestureEnabled: undefined,
  },
  slide: {
    keyboardHandlingEnabled: undefined,
    animation: undefined,
    animationMatchesGesture: undefined,
    fullScreenGestureEnabled: undefined,
  },
  follow: {
    keyboardHandlingEnabled: undefined,
    animation: "simple_push",
    animationMatchesGesture: true,
    fullScreenGestureEnabled: true,
  },
};

// Read when a screen is pushed, so a screen opened after the mode was changed
// gets the mode's options from its first frame.
const getBackSwipeOptions = () =>
  backSwipeOptions[useChatConfigStore.getState().backSwipeMode];

export const chatOptions = (): NativeStackNavigationOptions => ({
  ...header,
  title: "Chat Kit",
  headerTitle: renderContactTitle,
  ...getBackSwipeOptions(),
});

export const profileOptions = (): NativeStackNavigationOptions => ({
  ...header,
  title: "Contact",
  ...getBackSwipeOptions(),
});
