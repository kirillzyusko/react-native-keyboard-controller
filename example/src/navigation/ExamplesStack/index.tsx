import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { ScreenNames } from "../../constants/screenNames";
import AILegendListChat from "../../screens/Examples/AILegendListChat";
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
import KeyboardAvoidingViewAutomaticExample from "../../screens/Examples/KeyboardAvoidingViewAutomatic";
import KeyboardChatScrollViewPlayground from "../../screens/Examples/KeyboardChatScrollView";
import KeyboardExtender from "../../screens/Examples/KeyboardExtender";
import KeyboardSharedTransitionExample from "../../screens/Examples/KeyboardSharedTransitions";
import UseKeyboardState from "../../screens/Examples/KeyboardStateHook";
import LiquidKeyboardExample from "../../screens/Examples/LiquidKeyboard";
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

import { options } from "./options";

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
  [ScreenNames.KEYBOARD_AVOIDING_VIEW_AUTOMATIC]: undefined;
  [ScreenNames.ENABLED_DISABLED]: undefined;
  [ScreenNames.CLOSE]: undefined;
  [ScreenNames.FOCUSED_INPUT_HANDLERS]: undefined;
  [ScreenNames.TOOLBAR]: undefined;
  [ScreenNames.MODAL]: undefined;
  [ScreenNames.BOTTOM_TAB_BAR]: undefined;
  [ScreenNames.OVER_KEYBOARD_VIEW]: undefined;
  [ScreenNames.IMAGE_GALLERY]: undefined;
  [ScreenNames.USE_KEYBOARD_STATE]: undefined;
  [ScreenNames.LIQUID_KEYBOARD]: undefined;
  [ScreenNames.KEYBOARD_SHARED_TRANSITIONS]: undefined;
  [ScreenNames.KEYBOARD_EXTENDER]: undefined;
  [ScreenNames.CHAT_KIT]: undefined;
  [ScreenNames.AI_LEGEND_LIST_CHAT]: undefined;
};

const Stack = createStackNavigator<ExamplesStackParamList>();

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
      options={options[ScreenNames.REANIMATED_CHAT_FLAT_LIST]}
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
      component={KeyboardAvoidingViewAutomaticExample}
      name={ScreenNames.KEYBOARD_AVOIDING_VIEW_AUTOMATIC}
      options={options[ScreenNames.KEYBOARD_AVOIDING_VIEW_AUTOMATIC]}
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
    <Stack.Screen
      component={UseKeyboardState}
      name={ScreenNames.USE_KEYBOARD_STATE}
      options={options[ScreenNames.USE_KEYBOARD_STATE]}
    />
    <Stack.Screen
      component={LiquidKeyboardExample}
      name={ScreenNames.LIQUID_KEYBOARD}
      options={options[ScreenNames.LIQUID_KEYBOARD]}
    />
    <Stack.Screen
      component={KeyboardSharedTransitionExample}
      name={ScreenNames.KEYBOARD_SHARED_TRANSITIONS}
      options={options[ScreenNames.KEYBOARD_SHARED_TRANSITIONS]}
    />
    <Stack.Screen
      component={KeyboardExtender}
      name={ScreenNames.KEYBOARD_EXTENDER}
      options={options[ScreenNames.KEYBOARD_EXTENDER]}
    />
    <Stack.Screen
      component={KeyboardChatScrollViewPlayground}
      name={ScreenNames.CHAT_KIT}
      options={options[ScreenNames.CHAT_KIT]}
    />
    <Stack.Screen
      component={AILegendListChat}
      name={ScreenNames.AI_LEGEND_LIST_CHAT}
      options={options[ScreenNames.AI_LEGEND_LIST_CHAT]}
    />
  </Stack.Navigator>
);

export default ExamplesStack;
