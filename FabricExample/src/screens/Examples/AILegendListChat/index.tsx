import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import Animated, { FadeIn, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardChatLegendList } from "./KeyboardChatLegendList.tsx";

import type { LegendListRef } from "@legendapp/list";

type Message = {
  id: string;
  text: string;
  sender: "user" | "system";
  timeStamp: number;
  isPlaceholder?: boolean;
  isNew?: boolean;
};

const createId = () => String(Date.now());

const INITIAL_AI_TEXT = `Tip: Type 'a' for a short reply, 'b' for medium, 'c' for long, or 'd' for extra long. Any other text picks a random length.

React Native virtualization is a performance optimization technique that's crucial for handling large lists efficiently. Here's how it works:

1. **Rendering Only Visible Items**: Instead of rendering all items in a list at once, virtualization only renders the items that are currently visible on screen, plus a small buffer of items just outside the visible area.

2. **Dynamic Item Creation/Destruction**: As you scroll, items that move out of view are removed from the DOM/native view hierarchy, and new items that come into view are created. This keeps memory usage constant regardless of list size.

3. **View Recycling**: Advanced virtualization systems reuse view components rather than creating new ones, which reduces garbage collection and improves performance.

4. **Estimated vs Actual Sizing**: The system uses estimated item sizes to calculate scroll positions and total content size, then adjusts as actual sizes are measured.

5. **Legend List Implementation**: Legend List enhances this by providing better handling of dynamic item sizes, bidirectional scrolling, and maintains scroll position more accurately than FlatList.

The key benefits are:
- Constant memory usage regardless of data size
- Smooth scrolling performance
- Better handling of dynamic content
- Reduced time to interactive

This makes it possible to scroll through thousands of items without performance degradation, which is essential for modern mobile apps dealing with large datasets like social media feeds, chat histories, or product catalogs.

Tip: Type 'a' for a short reply, 'b' for medium, 'c' for long, or 'd' for extra long. Any other text picks a random length.`;

const INITIAL_MESSAGES: Message[] = [
  {
    id: "initial-user",
    sender: "user",
    text: "Hey, can you help me understand how React Native virtualization works?",
    timeStamp: Date.now(),
  },
  {
    id: "initial-ai",
    sender: "system",
    text: INITIAL_AI_TEXT,
    timeStamp: Date.now(),
  },
];

const AIResponse = ({
  text,
  isPlaceholder,
  timeStamp,
}: {
  text: string;
  isPlaceholder: boolean;
  timeStamp: number;
}) => {
  if (isPlaceholder) {
    return (
      <View
        style={[
          styles.messageContainer,
          styles.systemMessageContainer,
          styles.systemStyle,
        ]}
      >
        <View style={[styles.placeholderContainer, styles.messageContainer]}>
          <View style={styles.typingIndicator}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.placeholderText}>AI is thinking...</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.messageContainer,
        styles.systemMessageContainer,
        styles.systemStyle,
      ]}
    >
      <Text style={styles.messageText}>{text}</Text>
      <View style={[styles.timeStamp, styles.systemStyle]}>
        <Text style={styles.timeStampText}>
          {new Date(timeStamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

const LIFT_BEHAVIORS = ["always", "whenAtEnd", "persistent", "never"] as const;

type LiftBehavior = (typeof LIFT_BEHAVIORS)[number];

const REPLIES = [
  (msg: string) => `Got it! "${msg}" - let me know if you need more help.`,
  (msg: string) =>
    `I understand you said: "${msg}". That's a great point! Here are a few thoughts:\n\n1. First consideration\n2. Second aspect\n\nAnything else? First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.`,
  (msg: string) =>
    `I understand you said: "${msg}". This is a simulated AI response that demonstrates the streaming text functionality.\n\nLet me provide you with more details:\n\n1. First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.\n\n3. Third aspect to keep in mind - don't forget about the practical implications and how they might affect your decision.\n\n4. Fourth element worth exploring - sometimes the less obvious factors turn out to be the most significant.\n\nIn conclusion, I hope this helps clarify things. Is there anything else you'd like to know?`,
  (msg: string) =>
    `I understand you said: "${msg}". This is a simulated AI response that demonstrates the streaming text functionality.\n\nLet me provide you with more details:\n\n1. First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.\n\n3. Third aspect to keep in mind - don't forget about the practical implications and how they might affect your decision.\n\n4. Fourth element worth exploring - sometimes the less obvious factors turn out to be the most significant.\n\nIn conclusion, I hope this helps clarify things. Is there anything else you'd like to know? I understand you said: "${msg}". This is a simulated AI response that demonstrates the streaming text functionality.\n\nLet me provide you with more details:\n\n1. First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.\n\n3. Third aspect to keep in mind - don't forget about the practical implications and how they might affect your decision.\n\n4. Fourth element worth exploring - sometimes the less obvious factors turn out to be the most significant.\n\nIn conclusion, I hope this helps clarify things. Is there anything else you'd like to know? I understand you said: "${msg}". This is a simulated AI response that demonstrates the streaming text functionality.\n\nLet me provide you with more details:\n\n1. First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.\n\n3. Third aspect to keep in mind - don't forget about the practical implications and how they might affect your decision.\n\n4. Fourth element worth exploring - sometimes the less obvious factors turn out to be the most significant.\n\nIn conclusion, I hope this helps clarify things. Is there anything else you'd like to know?`,
];

function pickReply(input: string, userMessage: string): string {
  const letter = input.trim().toLowerCase().charAt(0);
  const index = letter.charCodeAt(0) - "a".charCodeAt(0);

  if (index >= 0 && index < REPLIES.length) {
    return REPLIES[index](userMessage);
  }

  return REPLIES[Math.floor(Math.random() * REPLIES.length)](userMessage);
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [liftBehavior, setLiftBehavior] = useState<LiftBehavior>("whenAtEnd");
  const [blankSizeIndex, setBlankSizeIndex] = useState<number | undefined>(
    undefined,
  );
  const listRef = useRef<LegendListRef>(null);
  const inputRef = useRef<TextInput>(null);
  const composerRef = useRef<View>(null);
  const activeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const insets = useSafeAreaInsets();
  // have to set an initial value higher than it will actually end up,
  // because reportContentInset doesn't work on android to ensure
  // initialScrollAtEnd works with extraContentPadding
  const composerHeight = useSharedValue(100);

  useLayoutEffect(() => {
    composerRef.current?.measure((_x, _y, _width, height) => {
      // eslint-disable-next-line react-compiler/react-compiler -- Reanimated shared values are designed to be mutated via .value
      composerHeight.value = height;
      listRef.current?.reportContentInset({ bottom: height });
    });
  }, []);

  const onComposerLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const { height } = event.nativeEvent.layout;

      composerHeight.value = height;
      listRef.current?.reportContentInset({ bottom: height });
    },
    [],
  );

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);

    activeTimers.current.push(id);

    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    activeTimers.current.forEach(clearTimeout);
    activeTimers.current = [];
    setIsStreaming(false);
  }, []);

  const doSendMessage = (text: string, rawInput: string) => {
    setBlankSizeIndex(messages.length);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: createId(),
        isNew: true,
        sender: "user",
        text: text,
        timeStamp: Date.now(),
      },
    ]);

    schedule(() => {
      listRef.current?.scrollToEnd({ animated: true });
      schedule(() => simulateAIResponse(text, rawInput), 800);
    }, 200);
  };

  const sendMessage = () => {
    const text = inputText.trim();

    if (!text) {
      return;
    }

    const rawInput = inputText;

    setInputText("");

    const isFocused = inputRef.current?.isFocused();

    if (isFocused) {
      inputRef.current?.blur();

      const subscription = Keyboard.addListener("keyboardDidHide", () => {
        subscription.remove();
        doSendMessage(text, rawInput);
      });
    } else {
      doSendMessage(text, rawInput);
    }
  };

  const simulateAIResponse = (userMessage: string, rawInput: string) => {
    const aiMessageId = createId();
    const responseText = pickReply(rawInput, userMessage);
    const words = responseText.split(" ");
    let currentWordIndex = 1;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: aiMessageId,
        sender: "system",
        text: words[0],
        timeStamp: Date.now(),
      },
    ]);

    setIsStreaming(true);

    const intervalId = setInterval(() => {
      currentWordIndex++;

      if (currentWordIndex <= words.length) {
        const currentText = words.slice(0, currentWordIndex).join(" ");

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: currentText } : msg,
          ),
        );
      } else {
        clearInterval(intervalId);
        setIsStreaming(false);
      }
    }, 16);

    activeTimers.current.push(intervalId);
  };

  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  return (
    <View style={styles.container}>
      <View style={styles.behaviorBar}>
        {LIFT_BEHAVIORS.map((b) => (
          <Text
            key={b}
            style={[
              styles.behaviorButton,
              b === liftBehavior && styles.behaviorButtonActive,
            ]}
            onPress={() => setLiftBehavior(b)}
          >
            {b}
          </Text>
        ))}
      </View>
      <KeyboardGestureArea
        interpolator="ios"
        offset={60}
        style={styles.container}
      >
        <KeyboardChatLegendList
          ref={listRef}
          initialScrollAtEnd
          maintainVisibleContentPosition
          blankSizeIndex={blankSizeIndex}
          contentContainerStyle={styles.contentContainer}
          data={messages}
          extraContentPadding={composerHeight}
          keyboardLiftBehavior={liftBehavior}
          keyExtractor={(_item, index) => `item-${index}`}
          maintainScrollAtEnd={Platform.OS === "web"}
          offset={insets.bottom}
          scrollIndicatorInsets={{ bottom: -insets.bottom }}
          renderItem={({ item }) => (
            <View>
              {item.sender === "user" ? (
                <Animated.View
                  entering={item.isNew ? FadeIn.duration(1000) : undefined}
                  style={[
                    styles.messageContainer,
                    styles.userMessageContainer,
                    styles.userStyle,
                  ]}
                >
                  <Text style={[styles.messageText, styles.userMessageText]}>
                    {item.text}
                  </Text>
                  <View style={[styles.timeStamp, styles.userStyle]}>
                    <Text style={styles.timeStampText}>
                      {new Date(item.timeStamp).toLocaleTimeString()}
                    </Text>
                  </View>
                </Animated.View>
              ) : (
                <AIResponse
                  isPlaceholder={!!item.isPlaceholder}
                  text={item.text}
                  timeStamp={item.timeStamp}
                />
              )}
            </View>
          )}
          style={styles.list}
        />
      </KeyboardGestureArea>
      <KeyboardStickyView
        offset={{ closed: 0, opened: insets.bottom }}
        style={styles.composerWrapper}
      >
        <View
          ref={composerRef}
          style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}
          onLayout={onComposerLayout}
        >
          <TextInput
            ref={inputRef}
            multiline
            editable={!isStreaming}
            focusable={!isStreaming}
            placeholder="Type a message"
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
          />
          <Button disabled={isStreaming} title="Send" onPress={sendMessage} />
        </View>
      </KeyboardStickyView>
    </View>
  );
};

const styles = StyleSheet.create({
  behaviorBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    zIndex: 1000,
  },
  behaviorButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 13,
    color: "#666",
    backgroundColor: "#ddd",
    overflow: "hidden",
  },
  behaviorButtonActive: {
    backgroundColor: "#007AFF",
    color: "#fff",
  },
  composerWrapper: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  dot: {
    backgroundColor: "#007AFF",
    borderRadius: 4,
    height: 8,
    marginHorizontal: 2,
    width: 8,
  },
  input: {
    backgroundColor: "white",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    padding: 10,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: "#ffffffa0",
    borderColor: "#ccc",
    borderTopWidth: 1,
    flexDirection: "row",
    padding: 10,
  },
  list: {
    flex: 1,
  },
  messageContainer: {
    borderRadius: 16,
    padding: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  placeholderContainer: {
    backgroundColor: "#f8f9fa",
    borderColor: "#e9ecef",
    borderWidth: 1,
  },
  placeholderText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  systemMessageContainer: {},
  systemStyle: {
    alignSelf: "flex-start",
    maxWidth: "85%",
  },
  timeStamp: {},
  timeStampText: {
    color: "#888",
    fontSize: 12,
  },
  typingIndicator: {
    alignItems: "center",
    flexDirection: "row",
  },
  userMessageContainer: {
    backgroundColor: "#007AFF",
  },
  userMessageText: {
    color: "white",
  },
  userStyle: {
    alignItems: "flex-end",
    alignSelf: "flex-end",
    maxWidth: "75%",
  },
});

export default AIChat;
