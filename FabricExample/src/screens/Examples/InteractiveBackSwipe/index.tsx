import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import type { InteractiveBackSwipeMode } from "react-native-keyboard-controller";

type Routes = { Setup: undefined; Chat: undefined };
type Settings = {
  mode: InteractiveBackSwipeMode;
  setMode: (mode: InteractiveBackSwipeMode) => void;
};

const Stack = createNativeStackNavigator<Routes>();
const SettingsContext = createContext<Settings | null>(null);
const bottomEdges = ["bottom"] as const;
const modes: InteractiveBackSwipeMode[] = ["close", "none", "interactively"];
const descriptions: Record<InteractiveBackSwipeMode, string> = {
  close: "Close the keyboard when the back transition starts.",
  none: "Keep the chat above the keyboard as both slide sideways.",
  interactively:
    "Move the chat down with the keyboard as you drag. Reverse to cancel.",
};

function ParentBackButton() {
  const navigation = useNavigation<NativeStackNavigationProp<Routes>>();

  if (!navigation.getParent()) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      testID="back-swipe.exit"
      onPress={() => navigation.getParent()?.goBack()}
    >
      <Text style={styles.back}>Back</Text>
    </Pressable>
  );
}

const setupOptions = {
  title: "Interactive back swipe",
  headerLeft: () => <ParentBackButton />,
};

function useSettings() {
  const settings = useContext(SettingsContext);

  if (!settings) {
    throw new Error("Interactive back swipe settings are missing");
  }

  return settings;
}

function ModeSelector({ screen }: { screen: "setup" | "chat" }) {
  const { mode, setMode } = useSettings();

  return (
    <View style={styles.settings}>
      <View accessibilityRole="radiogroup" style={styles.choices}>
        {modes.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityState={{ checked: mode === value }}
            style={[styles.choice, mode === value && styles.selected]}
            testID={`back-swipe.${screen}.mode.${value}`}
            onPress={() => setMode(value)}
          >
            <Text
              style={[styles.choiceText, mode === value && styles.selectedText]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.description}>{descriptions[mode]}</Text>
    </View>
  );
}

function Setup({ navigation }: NativeStackScreenProps<Routes, "Setup">) {
  return (
    <SafeAreaView edges={bottomEdges} style={styles.container}>
      <View style={styles.intro} testID="back-swipe.setup">
        <Text style={styles.title}>Interactive back swipe</Text>
        <Text style={styles.body}>
          Choose a mode, open the chat and focus the message field. Swipe right
          to go back, or reverse the gesture to return to the chat.
        </Text>
        <ModeSelector screen="setup" />
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
      </View>
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
    <SafeAreaView edges={bottomEdges} style={styles.container}>
      <View testID="back-swipe.chat">
        <ModeSelector screen="chat" />
      </View>
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
            {history.slice(-12).map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </ScrollView>
          <View style={styles.composer}>
            <TextInput
              multiline
              nativeID="back-swipe-input"
              placeholder="Message"
              style={styles.input}
              testID="chat.input"
              value={text}
              onChangeText={setText}
            />
          </View>
        </Reanimated.View>
      </View>
    </SafeAreaView>
  );
}

export default function InteractiveBackSwipe() {
  const [mode, setMode] = useState<InteractiveBackSwipeMode>("close");
  const settings = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <SettingsContext.Provider value={settings}>
      <Stack.Navigator>
        <Stack.Screen component={Setup} name="Setup" options={setupOptions} />
        <Stack.Screen
          component={Chat}
          name="Chat"
          options={{
            title: "Back swipe chat",
            fullScreenGestureEnabled: true,
            keyboardHandlingEnabled: mode === "close",
            animation: mode === "interactively" ? "simple_push" : "default",
            animationMatchesGesture: mode === "interactively",
          }}
        />
      </Stack.Navigator>
    </SettingsContext.Provider>
  );
}
