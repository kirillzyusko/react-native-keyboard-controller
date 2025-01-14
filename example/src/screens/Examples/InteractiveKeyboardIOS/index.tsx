import React, { useCallback, useRef, useState } from "react";
import { TextInput } from "react-native";
import {
  KeyboardGestureArea,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type { LayoutChangeEvent } from "react-native";

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const useKeyboardAnimation = () => {
  const progress = useSharedValue(0);
  const height = useSharedValue(0);
  const inset = useSharedValue(0);
  const offset = useSharedValue(0);
  const scroll = useSharedValue(0);
  const shouldUseOnMoveHandler = useSharedValue(false);

  useKeyboardHandler({
    onStart: (e) => {
      "worklet";

      // i. e. the keyboard was under interactive gesture, and will be showed
      // again. Since iOS will not schedule layout animation for that we can't
      // simply update `height` to destination and we need to listen to `onMove`
      // handler to have a smooth animation
      if (progress.value !== 1 && progress.value !== 0 && e.height !== 0) {
        // eslint-disable-next-line react-compiler/react-compiler
        shouldUseOnMoveHandler.value = true;

        return;
      }

      progress.value = e.progress;
      height.value = e.height;

      inset.value = e.height;
      // Math.max is needed to prevent overscroll when keyboard hides (and user scrolled to the top, for example)
      offset.value = Math.max(e.height + scroll.value, 0);
    },
    onInteractive: (e) => {
      "worklet";

      progress.value = e.progress;
      height.value = e.height;
    },
    onMove: (e) => {
      "worklet";

      if (shouldUseOnMoveHandler.value) {
        progress.value = e.progress;
        height.value = e.height;
      }
    },
    onEnd: (e) => {
      "worklet";

      height.value = e.height;
      progress.value = e.progress;
      shouldUseOnMoveHandler.value = false;
    },
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scroll.value = e.contentOffset.y - inset.value;
    },
  });

  return { height, progress, onScroll, inset, offset };
};

const TEXT_INPUT_HEIGHT = 50;

const contentContainerStyle = {
  paddingBottom: TEXT_INPUT_HEIGHT,
};

function InteractiveKeyboard() {
  const ref = useRef<Reanimated.ScrollView>(null);
  const { height, onScroll, inset, offset } = useKeyboardAnimation();
  const [inputHeight, setInputHeight] = useState(TEXT_INPUT_HEIGHT);
  const [text, setText] = useState("");

  const onInputLayoutChanged = useCallback((e: LayoutChangeEvent) => {
    setInputHeight(e.nativeEvent.layout.height);
  }, []);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollToEnd({ animated: false });
  }, []);

  const textInputStyle = useAnimatedStyle(
    () => ({
      position: "absolute",
      minHeight: TEXT_INPUT_HEIGHT,
      width: "100%",
      backgroundColor: "#BCBCBC",
      transform: [{ translateY: -height.value }],
    }),
    [],
  );

  const props = useAnimatedProps(() => ({
    contentInset: {
      bottom: inset.value,
    },
    contentOffset: {
      x: 0,
      y: offset.value,
    },
  }));

  return (
    <KeyboardGestureArea
      offset={inputHeight}
      style={styles.container}
      textInputNativeID="chat-input"
    >
      <Reanimated.ScrollView
        ref={ref}
        // simulation of `automaticallyAdjustKeyboardInsets` behavior on RN < 0.73
        animatedProps={props}
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={contentContainerStyle}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="interactive"
        testID="chat.scroll"
        onContentSizeChange={scrollToBottom}
        onScroll={onScroll}
      >
        {history.map((message, index) => (
          <Message key={index} {...message} />
        ))}
      </Reanimated.ScrollView>
      <AnimatedTextInput
        multiline
        nativeID="chat-input"
        style={textInputStyle}
        testID="chat.input"
        value={text}
        onChangeText={setText}
        onLayout={onInputLayoutChanged}
      />
    </KeyboardGestureArea>
  );
}

export default InteractiveKeyboard;
