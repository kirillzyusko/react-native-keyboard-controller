import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { ScreenNames } from "../../constants/screenNames";
import AwareScrollView from "../../screens/Examples/AwareScrollView";
import AwareScrollViewStickyFooter from "../../screens/Examples/AwareScrollViewStickyFooter";
import CloseScreen from "../../screens/Examples/Close";
import EnabledDisabled from "../../screens/Examples/EnabledDisabled";
import Events from "../../screens/Examples/Events";
import FocusedInputHandlers from "../../screens/Examples/FocusedInputHandlers";
import ImageGallery from "../../screens/Examples/ImageGallery";
import InteractiveKeyboard from "../../screens/Examples/InteractiveKeyboard";
import InteractiveKeyboardIOS from "../../screens/Examples/InteractiveKeyboardIOS";
import KeyboardAnimation from "../../screens/Examples/KeyboardAnimation";
import KeyboardAvoidingViewExample from "../../screens/Examples/KeyboardAvoidingView";
import LottieAnimation from "../../screens/Examples/Lottie";
import ModalExample from "../../screens/Examples/Modal";
import NonUIProps from "../../screens/Examples/NonUIProps";
import OverKeyboardView from "../../screens/Examples/OverKeyboardView";
import ReanimatedChat from "../../screens/Examples/ReanimatedChat";
import ReanimatedChatFlatList from "../../screens/Examples/ReanimatedChatFlatList";
import StatusBar from "../../screens/Examples/StatusBar";
import ToolbarExample from "../../screens/Examples/Toolbar";
import BottomTabBar from "../BottomTabBar";
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
  [ScreenNames.BOTTOM_TAB_BAR]: undefined;
  [ScreenNames.OVER_KEYBOARD_VIEW]: undefined;
  [ScreenNames.IMAGE_GALLERY]: undefined;
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
  [ScreenNames.BOTTOM_TAB_BAR]: {
    headerShown: false,
  },
  [ScreenNames.OVER_KEYBOARD_VIEW]: {
    title: "View over keyboard",
  },
  [ScreenNames.IMAGE_GALLERY]: {
    title: "Image gallery",
  },
};

const ExamplesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      component={KeyboardAnimation}
      name={ScreenNames.ANIMATED_EXAMPLE}
      options={options[ScreenNames.ANIMATED_EXAMPLE]}
    />
    <Stack.Screen
      component={ReanimatedChat}
      name={ScreenNames.REANIMATED_CHAT}
      options={options[ScreenNames.REANIMATED_CHAT]}
    />
    <Stack.Screen
      component={ReanimatedChatFlatList}
      name={ScreenNames.REANIMATED_CHAT_FLAT_LIST}
      options={options[ScreenNames.REANIMATED_CHAT]}
    />
    <Stack.Screen
      component={Events}
      name={ScreenNames.EVENTS}
      options={options[ScreenNames.EVENTS]}
    />
    <Stack.Screen
      component={AwareScrollView}
      name={ScreenNames.AWARE_SCROLL_VIEW}
      options={options[ScreenNames.AWARE_SCROLL_VIEW]}
    />
    <Stack.Screen
      component={AwareScrollViewStickyFooter}
      name={ScreenNames.AWARE_SCROLL_VIEW_STICKY_FOOTER}
      options={options[ScreenNames.AWARE_SCROLL_VIEW_STICKY_FOOTER]}
    />
    <Stack.Screen
      component={StatusBar}
      name={ScreenNames.STATUS_BAR}
      options={options[ScreenNames.STATUS_BAR]}
    />
    <Stack.Screen
      component={LottieAnimation}
      name={ScreenNames.LOTTIE}
      options={options[ScreenNames.LOTTIE]}
    />
    <Stack.Screen
      component={NonUIProps}
      name={ScreenNames.NON_UI_PROPS}
      options={options[ScreenNames.NON_UI_PROPS]}
    />
    <Stack.Screen
      component={InteractiveKeyboard}
      name={ScreenNames.INTERACTIVE_KEYBOARD}
      options={options[ScreenNames.INTERACTIVE_KEYBOARD]}
    />
    <Stack.Screen
      component={InteractiveKeyboardIOS}
      name={ScreenNames.INTERACTIVE_KEYBOARD_IOS}
      options={options[ScreenNames.INTERACTIVE_KEYBOARD_IOS]}
    />
    <Stack.Screen
      component={NativeStack}
      name={ScreenNames.NATIVE_STACK}
      options={options[ScreenNames.NATIVE_STACK]}
    />
    <Stack.Screen
      component={KeyboardAvoidingViewExample}
      name={ScreenNames.KEYBOARD_AVOIDING_VIEW}
      options={options[ScreenNames.KEYBOARD_AVOIDING_VIEW]}
    />
    <Stack.Screen
      component={EnabledDisabled}
      name={ScreenNames.ENABLED_DISABLED}
      options={options[ScreenNames.ENABLED_DISABLED]}
    />
    <Stack.Screen
      component={CloseScreen}
      name={ScreenNames.CLOSE}
      options={options[ScreenNames.CLOSE]}
    />
    <Stack.Screen
      component={FocusedInputHandlers}
      name={ScreenNames.FOCUSED_INPUT_HANDLERS}
      options={options[ScreenNames.FOCUSED_INPUT_HANDLERS]}
    />
    <Stack.Screen
      component={ToolbarExample}
      name={ScreenNames.TOOLBAR}
      options={options[ScreenNames.TOOLBAR]}
    />
    <Stack.Screen
      component={ModalExample}
      name={ScreenNames.MODAL}
      options={options[ScreenNames.MODAL]}
    />
    <Stack.Screen
      component={BottomTabBar}
      name={ScreenNames.BOTTOM_TAB_BAR}
      options={options[ScreenNames.BOTTOM_TAB_BAR]}
    />
    <Stack.Screen
      component={OverKeyboardView}
      name={ScreenNames.OVER_KEYBOARD_VIEW}
      options={options[ScreenNames.OVER_KEYBOARD_VIEW]}
    />
    <Stack.Screen
      component={ImageGallery}
      name={ScreenNames.IMAGE_GALLERY}
      options={options[ScreenNames.IMAGE_GALLERY]}
    />
  </Stack.Navigator>
);

export default ExamplesStack;
