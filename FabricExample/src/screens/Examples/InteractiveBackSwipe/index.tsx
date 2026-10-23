import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyboardController,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import styles from "./styles";

import type { NavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { InteractiveBackSwipeMode } from "react-native-keyboard-controller";

type Routes = { Setup: undefined; Chat: undefined };
type Settings = {
  mode: InteractiveBackSwipeMode | null;
  setMode: (mode: InteractiveBackSwipeMode | null) => void;
  jsStack: boolean;
  setJSStack: (enabled: boolean) => void;
  nativeDismiss: boolean;
  setNativeDismiss: (enabled: boolean) => void;
};

const NativeStack = createNativeStackNavigator<Routes>();
const JSStack = createStackNavigator<Routes>();
const SettingsContext = createContext<Settings | null>(null);
const bottomEdges = ["bottom"] as const;
const modes: InteractiveBackSwipeMode[] = ["close", "none", "interactively"];
const descriptions = {
  close: "Close the keyboard when the back transition starts.",
  none: "Keep the chat above the keyboard as both slide sideways.",
  interactively:
    "Move the chat down with the keyboard as you drag. Reverse to cancel.",
};
const baselines = [
  { value: "native", label: "Native stack" },
  { value: "native-dismiss", label: "Dismiss" },
  { value: "js", label: "JS stack" },
];
const messages = [
  { text: "Are we still meeting on Saturday?", sent: false },
  { text: "Yes! Let's meet by the river at 10.", sent: true },
  { text: "I'll bring coffee ☕", sent: false },
  { text: "Perfect. See you there!", sent: true },
  { text: "One more thing — send me the location?", sent: false },
  { text: "Sure, I'll send it in a minute.", sent: true },
];

function useSettings() {
  const settings = useContext(SettingsContext);

  if (!settings) {
    throw new Error("Interactive back swipe settings are missing");
  }

  return settings;
}

function ParentBackButton() {
  const navigation = useNavigation<NavigationProp<Routes>>();

  return (
    <Pressable
      accessibilityRole="button"
      testID="back-swipe.exit"
      onPress={() => navigation.getParent()?.goBack()}
    >
      <Text style={styles.back}>Examples</Text>
    </Pressable>
  );
}

const setupOptions = {
  title: "Interactive back swipe",
  headerLeft: () => <ParentBackButton />,
};

function Setup() {
  const navigation = useNavigation<NavigationProp<Routes>>();
  const {
    mode,
    setMode,
    jsStack,
    setJSStack,
    nativeDismiss,
    setNativeDismiss,
  } = useSettings();
  let selectedBaseline = "native";
  let navigatorName = "native stack";

  if (nativeDismiss) {
    selectedBaseline = "native-dismiss";
    navigatorName = "native stack, dismiss enabled";
  }
  if (jsStack) {
    selectedBaseline = "js";
    navigatorName = "JS stack";
  }

  return (
    <SafeAreaView edges={bottomEdges} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.intro}
        testID="back-swipe.setup"
      >
        <Text style={styles.title}>Interactive back swipe</Text>
        <Text style={styles.body}>
          Open the chat and focus Message. Swipe right to go back, or reverse
          the gesture to return to the chat.
        </Text>
        <View accessibilityRole="radiogroup" style={styles.choices}>
          {modes.map((value) => (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ checked: mode === value }}
              style={[styles.choice, mode === value && styles.selected]}
              testID={`back-swipe.setup.mode.${value}`}
              onPress={() => {
                setJSStack(false);
                setMode(value);
              }}
            >
              <Text
                style={[
                  styles.choiceText,
                  mode === value && styles.selectedText,
                ]}
              >
                {value}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.description}>
          {mode
            ? descriptions[mode]
            : `React Navigation defaults · ${navigatorName} · no policy`}
        </Text>
        <Text style={styles.label}>Compare with React Navigation defaults</Text>
        <View style={styles.choices}>
          {baselines.map(({ value, label }) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              style={[
                styles.choice,
                mode === null && selectedBaseline === value && styles.selected,
              ]}
              testID={`back-swipe.default.${value}`}
              onPress={() => {
                setMode(null);
                setJSStack(value === "js");
                setNativeDismiss(value === "native-dismiss");
              }}
            >
              <Text
                style={[
                  styles.choiceText,
                  mode === null &&
                    selectedBaseline === value &&
                    styles.selectedText,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          disabled={Platform.OS !== "ios"}
          style={styles.open}
          testID="back-swipe.open"
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={styles.openText}>
            {Platform.OS === "ios" ? "Open chat" : "Available on iOS"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Chat() {
  const { mode } = useSettings();
  const { bottom } = useSafeAreaInsets();
  const { height } = useReanimatedKeyboardAnimation();
  const translation = useAnimatedStyle(() => ({
    transform: [{ translateY: height.value + Math.min(bottom, -height.value) }],
  }));
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    KeyboardController.setInteractiveBackSwipe(mode);
  }, [mode]);

  return (
    <SafeAreaView
      edges={bottomEdges}
      style={[styles.container, styles.chatBackground]}
      testID="back-swipe.gesture"
    >
      <View style={styles.viewport}>
        <Reanimated.View style={[styles.chat, translation]}>
          <ScrollView
            ref={scroll}
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={styles.messages}
            contentInsetAdjustmentBehavior="never"
            keyboardDismissMode="interactive"
            testID="back-swipe.messages"
            onContentSizeChange={() =>
              scroll.current?.scrollToEnd({ animated: false })
            }
          >
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.bubble,
                  message.sent ? styles.sent : styles.received,
                ]}
              >
                <Text style={[styles.message, message.sent && styles.sentText]}>
                  {message.text}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.composer} testID="back-swipe.composer">
            <Text style={styles.plus}>＋</Text>
            <TextInput
              multiline
              nativeID="back-swipe-input"
              placeholder="Message"
              placeholderTextColor="#85858b"
              style={styles.input}
              testID="chat.input"
              value={text}
              onChangeText={setText}
            />
            <Text style={styles.send}>↑</Text>
          </View>
        </Reanimated.View>
      </View>
    </SafeAreaView>
  );
}

function NativeNavigator() {
  const { mode, nativeDismiss } = useSettings();
  const chatOptions = useMemo<NativeStackNavigationOptions>(() => {
    const options: NativeStackNavigationOptions = {
      title: "Chat",
      headerTintColor: "#1675e9",
    };

    if (mode) {
      return {
        ...options,
        fullScreenGestureEnabled: true,
        keyboardHandlingEnabled: mode === "close",
        animation: mode === "interactively" ? "simple_push" : "default",
        animationMatchesGesture: mode === "interactively",
      };
    }
    if (nativeDismiss) {
      return {
        ...options,
        keyboardHandlingEnabled: true,
        fullScreenGestureEnabled: true,
      };
    }

    return options;
  }, [mode, nativeDismiss]);

  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        component={Setup}
        name="Setup"
        options={setupOptions}
      />
      <NativeStack.Screen component={Chat} name="Chat" options={chatOptions} />
    </NativeStack.Navigator>
  );
}

function JSNavigator() {
  return (
    <JSStack.Navigator>
      <JSStack.Screen component={Setup} name="Setup" options={setupOptions} />
      <JSStack.Screen
        component={Chat}
        name="Chat"
        options={{ title: "Chat" }}
      />
    </JSStack.Navigator>
  );
}

export default function InteractiveBackSwipe() {
  const [mode, setMode] = useState<InteractiveBackSwipeMode | null>("close");
  const [jsStack, setJSStack] = useState(false);
  const [nativeDismiss, setNativeDismiss] = useState(false);
  const settings = useMemo(
    () => ({
      mode,
      setMode,
      jsStack,
      setJSStack,
      nativeDismiss,
      setNativeDismiss,
    }),
    [mode, jsStack, nativeDismiss],
  );

  return (
    <SettingsContext.Provider value={settings}>
      {jsStack ? <JSNavigator /> : <NativeNavigator />}
    </SettingsContext.Provider>
  );
}
