import { useCallback, useEffect, useRef, useState } from "react";
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
  KeyboardProvider,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { LegendListRef } from "@legendapp/list";

import { KeyboardChatLegendList } from "./KeyboardChatLegendList.tsx";

type Message = {
  id: string;
  text: string;
  sender: "user" | "system";
  timeStamp: number;
  isPlaceholder?: boolean;
  isNew?: boolean;
  streamingSpeed?: number;
};

const createId = () => String(Date.now());

const AIResponse = ({
  text,
  isPlaceholder,
  timeStamp,
  streamingSpeed = 15,
}: {
  text: string;
  isPlaceholder: boolean;
  timeStamp: number;
  streamingSpeed?: number;
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (isPlaceholder || !text) {
      setDisplayedText("");
      return;
    }

    const words = text.split(" ");
    let currentWordIndex = 0;

    const intervalId = setInterval(() => {
      currentWordIndex++;
      if (currentWordIndex <= words.length) {
        setDisplayedText(words.slice(0, currentWordIndex).join(" "));
      } else {
        clearInterval(intervalId);
      }
    }, streamingSpeed);

    return () => clearInterval(intervalId);
  }, [text, isPlaceholder, streamingSpeed]);

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
      <Text style={styles.messageText}>{displayedText}</Text>
      <View style={[styles.timeStamp, styles.systemStyle]}>
        <Text style={styles.timeStampText}>
          {new Date(timeStamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [extraContentPaddingIndex, setExtraContentPaddingIndex] = useState<
    number | undefined
  >(undefined);
  const listRef = useRef<LegendListRef>(null);
  const inputRef = useRef<TextInput>(null);
  const hasInitialized = useRef(false);
  const activeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const insets = useSafeAreaInsets();

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    activeTimers.current.push(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    activeTimers.current.forEach(clearTimeout);
    activeTimers.current = [];
  }, []);

  const doSendMessage = (text: string) => {
    setExtraContentPaddingIndex(messages.length);

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
      schedule(() => simulateAIResponse(text), 800);
    }, 200);
  };

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    setInputText("");

    const isFocused = inputRef.current?.isFocused();

    if (isFocused) {
      inputRef.current?.blur();

      const subscription = Keyboard.addListener("keyboardDidHide", () => {
        subscription.remove();
        doSendMessage(text);
      });
    } else {
      doSendMessage(text);
    }
  };

  const simulateAIResponse = (userMessage: string) => {
    const aiMessageId = createId();

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: aiMessageId,
        isPlaceholder: true,
        sender: "system",
        text: "",
        timeStamp: Date.now(),
      },
    ]);

    schedule(() => {
      const replies = [
        `Got it! "${userMessage}" - let me know if you need more help.`,
        `I understand you said: "${userMessage}". That's a great point! Here are a few thoughts:\n\n1. First consideration\n2. Second aspect\n\nAnything else? First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.`,
        `I understand you said: "${userMessage}". This is a simulated AI response that demonstrates the streaming text functionality.\n\nLet me provide you with more details:\n\n1. First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.\n\n3. Third aspect to keep in mind - don't forget about the practical implications and how they might affect your decision.\n\n4. Fourth element worth exploring - sometimes the less obvious factors turn out to be the most significant.\n\nIn conclusion, I hope this helps clarify things. Is there anything else you'd like to know?`,
        `I understand you said: "${userMessage}". This is a simulated AI response that demonstrates the streaming text functionality.\n\nLet me provide you with more details:\n\n1. First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.\n\n3. Third aspect to keep in mind - don't forget about the practical implications and how they might affect your decision.\n\n4. Fourth element worth exploring - sometimes the less obvious factors turn out to be the most significant.\n\nIn conclusion, I hope this helps clarify things. Is there anything else you'd like to know? I understand you said: "${userMessage}". This is a simulated AI response that demonstrates the streaming text functionality.\n\nLet me provide you with more details:\n\n1. First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.\n\n3. Third aspect to keep in mind - don't forget about the practical implications and how they might affect your decision.\n\n4. Fourth element worth exploring - sometimes the less obvious factors turn out to be the most significant.\n\nIn conclusion, I hope this helps clarify things. Is there anything else you'd like to know? I understand you said: "${userMessage}". This is a simulated AI response that demonstrates the streaming text functionality.\n\nLet me provide you with more details:\n\n1. First point about your question - this is important to consider when thinking about the broader context of your inquiry.\n\n2. Second important consideration - there are multiple angles to approach this from, and each has its own merits.\n\n3. Third aspect to keep in mind - don't forget about the practical implications and how they might affect your decision.\n\n4. Fourth element worth exploring - sometimes the less obvious factors turn out to be the most significant.\n\nIn conclusion, I hope this helps clarify things. Is there anything else you'd like to know?`,
      ];
      const responseText = replies[Math.floor(Math.random() * replies.length)];

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, isPlaceholder: false, text: responseText }
            : msg,
        ),
      );
    }, 600);
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initialAiMessageId = createId();

    const fullText = `React Native virtualization is a performance optimization technique that's crucial for handling large lists efficiently. Here's how it works:

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

This makes it possible to scroll through thousands of items without performance degradation, which is essential for modern mobile apps dealing with large datasets like social media feeds, chat histories, or product catalogs.`;

    schedule(() => {
      setMessages([
        {
          id: createId(),
          sender: "user",
          text: "Hey, can you help me understand how React Native virtualization works?",
          timeStamp: Date.now(),
        },
        {
          id: initialAiMessageId,
          isPlaceholder: true,
          sender: "system",
          text: "",
          timeStamp: Date.now(),
        },
      ]);
    }, 500);

    schedule(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === initialAiMessageId
            ? {
                ...msg,
                isPlaceholder: false,
                text: fullText,
                streamingSpeed: 1,
              }
            : msg,
        ),
      );
    }, 1500);

    return clearAllTimers;
  }, [clearAllTimers, schedule]);

  return (
    <View style={styles.container}>
      <KeyboardGestureArea
        interpolator="ios"
        offset={60}
        style={styles.container}
      >
        <KeyboardChatLegendList
          extraContentPaddingIndex={extraContentPaddingIndex}
          contentContainerStyle={styles.contentContainer}
          data={messages}
          initialScrollAtEnd
          keyExtractor={(_item, index) => `item-${index}`}
          maintainScrollAtEnd={Platform.OS === "web"}
          maintainVisibleContentPosition
          keyboardLiftBehavior="never"
          offset={insets.bottom}
          ref={listRef}
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
                  streamingSpeed={item.streamingSpeed}
                  text={item.text}
                  timeStamp={item.timeStamp}
                />
              )}
            </View>
          )}
          style={styles.list}
        />
      </KeyboardGestureArea>
      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View
          style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}
        >
          <TextInput
            multiline
            onChangeText={setInputText}
            placeholder="Type a message"
            ref={inputRef}
            style={styles.input}
            value={inputText}
          />
          <Button onPress={sendMessage} title="Send" />
        </View>
      </KeyboardStickyView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "transparent",
    borderColor: "#ccc",
    borderTopWidth: 1,
    flexDirection: "row",
    padding: 10,
  },
  list: {
    flex: 1,
    overflow: "visible",
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
