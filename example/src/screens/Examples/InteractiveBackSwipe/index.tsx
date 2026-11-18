import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import styles from "./styles";

import type { NavigationProp, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

type Keyboard = "dismiss" | "slide" | "follow";
type Routes = {
  Setup: undefined;
  Chat: { keyboard: Keyboard };
  Profile: { keyboard: Keyboard };
};
type Screen = { route: RouteProp<Routes, "Chat" | "Profile"> };

const Stack = createNativeStackNavigator<Routes>();
const bottomEdges = ["bottom"] as const;
const contact = "Ksu";
// the keyboard is a part of the transition, so its behavior is selected by the screen options
const keyboards: Record<
  Keyboard,
  { description: string; options: NativeStackNavigationOptions }
> = {
  dismiss: {
    description:
      "The keyboard closes when the swipe starts and opens again if the swipe is cancelled (Notes, Telegram).",
    options: { keyboardHandlingEnabled: true },
  },
  slide: {
    description:
      "The keyboard slides away together with its screen (Messages, WhatsApp).",
    options: {},
  },
  follow: {
    description: "The keyboard goes down as you drag the screen (Instagram).",
    options: {
      animation: "simple_push",
      animationMatchesGesture: true,
      fullScreenGestureEnabled: true,
    },
  },
};
const messages = [
  { text: "Are we still meeting on Saturday?", sent: false },
  { text: "Yes! Let's meet by the river at 10.", sent: true },
  { text: "I'll bring coffee ☕", sent: false },
  { text: "Perfect. See you there!", sent: true },
  { text: "One more thing — send me the location?", sent: false },
  { text: "Sure, I'll send it in a minute.", sent: true },
];

function Contact() {
  const navigation = useNavigation<NavigationProp<Routes>>();
  const { params } = useRoute<RouteProp<Routes, "Chat">>();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.contact}
      testID="chat.contact"
      onPress={() => navigation.navigate("Profile", params)}
    >
      <View style={styles.avatar}>
        <Text style={styles.initial}>{contact[0]}</Text>
      </View>
      <Text style={styles.name}>{contact}</Text>
    </TouchableOpacity>
  );
}

// the first screen of the nested stack has nothing to go back to, so its button leaves the example
const setupOptions = ({
  navigation,
}: {
  navigation: NavigationProp<Routes>;
}): NativeStackNavigationOptions => ({
  title: "Interactive back swipe",
  headerLeft: (props) => (
    <HeaderBackButton
      {...props}
      displayMode="minimal"
      testID="back-swipe.exit"
      onPress={navigation.goBack}
    />
  ),
});
// the chat and the profile are swiped back in the same way
const screenOptions = ({ route }: Screen): NativeStackNavigationOptions => ({
  headerBackButtonDisplayMode: "minimal",
  ...keyboards[route.params.keyboard].options,
});
const chatOptions = (screen: Screen): NativeStackNavigationOptions => ({
  ...screenOptions(screen),
  title: "Chat",
  headerTitle: () => <Contact />,
});
const profileOptions = (screen: Screen): NativeStackNavigationOptions => ({
  ...screenOptions(screen),
  title: "Profile",
});

function Setup() {
  const navigation = useNavigation<NavigationProp<Routes>>();
  const [keyboard, setKeyboard] = useState<Keyboard>("slide");

  return (
    <SafeAreaView edges={bottomEdges} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.intro}
        testID="back-swipe.setup"
      >
        <Text style={styles.title}>Interactive back swipe</Text>
        <Text style={styles.body}>
          Open the chat and focus Message. Swipe right to go back, or reverse
          the gesture to return to the chat. Tap the name in the header to push
          one more screen with an input.
        </Text>
        <View accessibilityRole="radiogroup" style={styles.choices}>
          {(Object.keys(keyboards) as Keyboard[]).map((value) => (
            <TouchableOpacity
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ checked: keyboard === value }}
              style={[styles.choice, keyboard === value && styles.selected]}
              testID={`back-swipe.setup.keyboard.${value}`}
              onPress={() => setKeyboard(value)}
            >
              <Text
                style={[
                  styles.choiceText,
                  keyboard === value && styles.selectedText,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.description}>
          {keyboards[keyboard].description}
        </Text>
        <TouchableOpacity
          style={styles.open}
          testID="back-swipe.open"
          onPress={() => navigation.navigate("Chat", { keyboard })}
        >
          <Text style={styles.openText}>Open chat</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Chat() {
  const { bottom } = useSafeAreaInsets();
  const offset = useMemo(() => ({ opened: bottom }), [bottom]);
  const [text, setText] = useState("");

  return (
    <SafeAreaView
      edges={bottomEdges}
      style={[styles.container, styles.chatBackground]}
      testID="back-swipe.chat"
    >
      <KeyboardChatScrollView
        contentContainerStyle={styles.messages}
        keyboardDismissMode="interactive"
        offset={bottom}
        testID="back-swipe.messages"
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
      </KeyboardChatScrollView>
      <KeyboardStickyView
        offset={offset}
        style={styles.composer}
        testID="back-swipe.composer"
      >
        <Text style={styles.plus}>＋</Text>
        <TextInput
          multiline
          placeholder="Message"
          placeholderTextColor="#85858b"
          style={styles.input}
          testID="chat.input"
          value={text}
          onChangeText={setText}
        />
        <Text style={styles.send}>↑</Text>
      </KeyboardStickyView>
    </SafeAreaView>
  );
}

function Profile() {
  return (
    <ScrollView
      contentContainerStyle={styles.profile}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      style={styles.container}
      testID="back-swipe.profile"
    >
      <View style={[styles.avatar, styles.portrait]}>
        <Text style={[styles.initial, styles.portraitInitial]}>
          {contact[0]}
        </Text>
      </View>
      <TextInput
        autoCorrect={false}
        defaultValue={contact}
        placeholder="Name"
        placeholderTextColor="#85858b"
        style={styles.field}
        testID="profile.name"
      />
      <Text style={styles.hint}>
        Swipe back right away or focus the name first: the chat below may have
        its own keyboard.
      </Text>
    </ScrollView>
  );
}

export default function InteractiveBackSwipe() {
  return (
    <Stack.Navigator>
      <Stack.Screen component={Setup} name="Setup" options={setupOptions} />
      <Stack.Screen component={Chat} name="Chat" options={chatOptions} />
      <Stack.Screen
        component={Profile}
        name="Profile"
        options={profileOptions}
      />
    </Stack.Navigator>
  );
}
