import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { ScreenNames } from "../../constants/screenNames";
import AwareScrollView from "../../screens/Examples/AwareScrollView";
import AwareScrollViewStickyFooter from "../../screens/Examples/AwareScrollViewStickyFooter";
import CloseScreen from "../../screens/Examples/Close";
import EnabledDisabled from "../../screens/Examples/EnabledDisabled";
import Events from "../../screens/Examples/Events";
import FocusedInputHandlers from "../../screens/Examples/FocusedInputHandlers";
import InteractiveKeyboard from "../../screens/Examples/InteractiveKeyboard";
import InteractiveKeyboardIOS from "../../screens/Examples/InteractiveKeyboardIOS";
import KeyboardAnimation from "../../screens/Examples/KeyboardAnimation";
import KeyboardAvoidingViewExample from "../../screens/Examples/KeyboardAvoidingView";
import LottieAnimation from "../../screens/Examples/Lottie";
import ModalExample from "../../screens/Examples/Modal";
import NonUIProps from "../../screens/Examples/NonUIProps";
import ReanimatedChat from "../../screens/Examples/ReanimatedChat";
import ReanimatedChatFlatList from "../../screens/Examples/ReanimatedChatFlatList";
import StatusBar from "../../screens/Examples/StatusBar";
import ToolbarExample from "../../screens/Examples/Toolbar";
import NativeStack from "../NestedStack";

export type ExamplesStackParamList = {
  [ScreenNames.ANIMATED_EXAMPLE]: undefined;
  [ScreenNames.REANIMATED_CHAT]: undefined;
  [ScreenNames.REANIMATED_CHAT_FLAT_LIST]: undefined;
  [ScreenNames.EVENTS]: undefined;
  [ScreenNames.AWARE_SCROLL_VIEW]: undefined;
  [ScreenNames.AWARE_SCROLL_VIEW_STICKY_FOOTER]: undefined;
  [ScreenNames.STATUS_BAR]: undefined;
  [ScreenNames.LOTTIE]: undefined;
  [ScreenNames.NON_UI_PROPS]: undefined;
  [ScreenNames.INTERACTIVE_KEYBOARD]: undefined;
  [ScreenNames.INTERACTIVE_KEYBOARD_IOS]: undefined;
  [ScreenNames.NATIVE_STACK]: undefined;
  [ScreenNames.KEYBOARD_AVOIDING_VIEW]: undefined;
  [ScreenNames.ENABLED_DISABLED]: undefined;
  [ScreenNames.CLOSE]: undefined;
  [ScreenNames.FOCUSED_INPUT_HANDLERS]: undefined;
  [ScreenNames.TOOLBAR]: undefined;
  [ScreenNames.MODAL]: undefined;
};

const Stack = createStackNavigator<ExamplesStackParamList>();

const options = {
  [ScreenNames.ANIMATED_EXAMPLE]: {
    title: "Keyboard animation ⌨️",
  },
  [ScreenNames.REANIMATED_CHAT]: {
    title: "Chat",
  },
  [ScreenNames.REANIMATED_CHAT_FLAT_LIST]: {
    title: "Chat FlatList",
  },
  [ScreenNames.EVENTS]: {
    title: "Events",
  },
  [ScreenNames.AWARE_SCROLL_VIEW]: {
    title: "Aware scroll view",
  },
  [ScreenNames.AWARE_SCROLL_VIEW_STICKY_FOOTER]: {
    title: "Aware scroll view sticky footer",
  },
  [ScreenNames.STATUS_BAR]: {
    headerShown: false,
    title: "Status bar manipulation",
  },
  [ScreenNames.LOTTIE]: {
    title: "Lottie animation",
  },
  [ScreenNames.NON_UI_PROPS]: {
    title: "Non UI Props",
  },
  [ScreenNames.INTERACTIVE_KEYBOARD]: {
    title: "Interactive keyboard",
  },
  [ScreenNames.INTERACTIVE_KEYBOARD_IOS]: {
    title: "Interactive keyboard 🍏",
  },
  [ScreenNames.NATIVE_STACK]: {
    title: "Native stack",
  },
  [ScreenNames.KEYBOARD_AVOIDING_VIEW]: {
    title: "KAV",
  },
  [ScreenNames.ENABLED_DISABLED]: {
    title: "Enabled/disabled",
  },
  [ScreenNames.CLOSE]: {
    title: "Close keyboard",
  },
  [ScreenNames.FOCUSED_INPUT_HANDLERS]: {
    title: "Focused input handlers",
  },
  [ScreenNames.TOOLBAR]: {
    title: "Toolbar",
  },
  [ScreenNames.MODAL]: {
    title: "Modal",
  },
};

const ExamplesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={ScreenNames.ANIMATED_EXAMPLE}
      component={KeyboardAnimation}
      options={options[ScreenNames.ANIMATED_EXAMPLE]}
    />
    <Stack.Screen
      name={ScreenNames.REANIMATED_CHAT}
      component={ReanimatedChat}
      options={options[ScreenNames.REANIMATED_CHAT]}
    />
    <Stack.Screen
      name={ScreenNames.REANIMATED_CHAT_FLAT_LIST}
      component={ReanimatedChatFlatList}
      options={options[ScreenNames.REANIMATED_CHAT]}
    />
    <Stack.Screen
      name={ScreenNames.EVENTS}
      component={Events}
      options={options[ScreenNames.EVENTS]}
    />
    <Stack.Screen
      name={ScreenNames.AWARE_SCROLL_VIEW}
      component={AwareScrollView}
      options={options[ScreenNames.AWARE_SCROLL_VIEW]}
    />
    <Stack.Screen
      name={ScreenNames.AWARE_SCROLL_VIEW_STICKY_FOOTER}
      component={AwareScrollViewStickyFooter}
      options={options[ScreenNames.AWARE_SCROLL_VIEW_STICKY_FOOTER]}
    />
    <Stack.Screen
      name={ScreenNames.STATUS_BAR}
      component={StatusBar}
      options={options[ScreenNames.STATUS_BAR]}
    />
    <Stack.Screen
      name={ScreenNames.LOTTIE}
      component={LottieAnimation}
      options={options[ScreenNames.LOTTIE]}
    />
    <Stack.Screen
      name={ScreenNames.NON_UI_PROPS}
      component={NonUIProps}
      options={options[ScreenNames.NON_UI_PROPS]}
    />
    <Stack.Screen
      name={ScreenNames.INTERACTIVE_KEYBOARD}
      component={InteractiveKeyboard}
      options={options[ScreenNames.INTERACTIVE_KEYBOARD]}
    />
    <Stack.Screen
      name={ScreenNames.INTERACTIVE_KEYBOARD_IOS}
      component={InteractiveKeyboardIOS}
      options={options[ScreenNames.INTERACTIVE_KEYBOARD_IOS]}
    />
    <Stack.Screen
      name={ScreenNames.NATIVE_STACK}
      component={NativeStack}
      options={options[ScreenNames.NATIVE_STACK]}
    />
    <Stack.Screen
      name={ScreenNames.KEYBOARD_AVOIDING_VIEW}
      component={KeyboardAvoidingViewExample}
      options={options[ScreenNames.KEYBOARD_AVOIDING_VIEW]}
    />
    <Stack.Screen
      name={ScreenNames.ENABLED_DISABLED}
      component={EnabledDisabled}
      options={options[ScreenNames.ENABLED_DISABLED]}
    />
    <Stack.Screen
      name={ScreenNames.CLOSE}
      component={CloseScreen}
      options={options[ScreenNames.CLOSE]}
    />
    <Stack.Screen
      name={ScreenNames.FOCUSED_INPUT_HANDLERS}
      component={FocusedInputHandlers}
      options={options[ScreenNames.FOCUSED_INPUT_HANDLERS]}
    />
    <Stack.Screen
      name={ScreenNames.TOOLBAR}
      component={ToolbarExample}
      options={options[ScreenNames.TOOLBAR]}
    />
    <Stack.Screen
      name={ScreenNames.MODAL}
      component={ModalExample}
      options={options[ScreenNames.MODAL]}
    />
  </Stack.Navigator>
);

export default ExamplesStack;
