import * as React from 'react';

import { Animated, StyleSheet, View, TextInput, Text } from 'react-native';
import {
  KeyboardProvider,
  useKeyboardAnimation,
} from 'react-native-keyboard-controller';

type MessageProps = {
  text: string;
  sender?: boolean;
};

const history: MessageProps[] = [
  { text: 'Hmmmm🤔' },
  { text: 'It looks like it still will be laggy...' },
  { text: "But I don't know what should I try next" },
  { text: 'Reanimated?', sender: true },
  { text: 'A little bit disappointed 😔' },
  { text: '🤯' },
  { text: 'Try to check it. I hope it helps you...', sender: true },
  { text: 'It really pushes you to think twice on how to design it first' },
  {
    text: 'Looks promising!😎 I was always looking for a solution that would allow us to run animations on native thread and provide at least stable 60 FPS',
  },
  { text: 'You have to check it!!!', sender: true },
  { text: "Ha-ha! I'm definitely going to check it!" },
  { text: 'Hello! How are you?' },
  { text: "Hi! I'm good. How are you?", sender: true },
  {
    text: "I'm fine, thank you! Have you seen new keyboard animation library?",
  },
  { text: 'No! Let me check.', sender: true },
  {
    text: "Wow! I've been looking for it for a while. It's awesome!",
    sender: true,
  },
];

function Message({ text, sender }: MessageProps) {
  return (
    <View
      style={{
        alignSelf: sender ? 'flex-end' : 'flex-start',
        backgroundColor: sender ? '#e0e0e0' : '#50FF00',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        marginVertical: 5,
      }}
    >
      <Text>{text}</Text>
    </View>
  );
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function KeyboardAnimation() {
  const { height } = useKeyboardAnimation();

  return (
    <View style={{ justifyContent: 'flex-end', flex: 1 }}>
      <Animated.ScrollView style={{ transform: [{ translateY: height }] }}>
        {history.map((message, index) => (
          <Message key={index} {...message} />
        ))}
      </Animated.ScrollView>
      <AnimatedTextInput
        style={{
          height: 50,
          width: '100%',
          backgroundColor: '#ECECEC',
          transform: [{ translateY: height }],
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <KeyboardProvider>
      <KeyboardAnimation />
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
  },
});
