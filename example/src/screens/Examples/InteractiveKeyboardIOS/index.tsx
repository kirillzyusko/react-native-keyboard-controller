import React, { useCallback, useRef } from "react";
import { TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

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
        shouldUseOnMoveHandler.value = true;
        return;
      }

      console.log("onStart", e);

      progress.value = e.progress;
      height.value = e.height;

      inset.value = e.height;
      // Math.max is needed to prevent overscroll when keyboard hides (and user scrolled to the top, for example)
      offset.value = Math.max(e.height + scroll.value, 0);
    },
    onInteractive: (e) => {
      "worklet";
      console.log("onInteractive", e);
      progress.value = e.progress;
      height.value = e.height;
    },
    onMove: (e) => {
      "worklet";

      if (shouldUseOnMoveHandler.value) {
        progress.value = e.progress;
        height.value = e.height;

        console.log("onMove", e);
      }
    },
    onEnd: (e) => {
      "worklet";

      console.log("onEnd", e);

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

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollToEnd({ animated: false });
  }, []);

  const textInputStyle = useAnimatedStyle(
    () => ({
      position: "absolute",
      height: TEXT_INPUT_HEIGHT,
      width: "100%",
      backgroundColor: "#BCBCBC",
      transform: [
        {
          translateY: -height.value,
        },
      ],
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
    <View style={styles.container}>
      <Reanimated.ScrollView
        ref={ref}
        onContentSizeChange={scrollToBottom}
        contentContainerStyle={contentContainerStyle}
        keyboardDismissMode="interactive"
        // simulation of `automaticallyAdjustKeyboardInsets` behavior on RN < 0.73
        animatedProps={props}
        onScroll={onScroll}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
      >
        {history.map((message, index) => (
          <Message key={index} {...message} />
        ))}
      </Reanimated.ScrollView>
      <AnimatedTextInput style={textInputStyle} />
    </View>
  );
}

export default InteractiveKeyboard;
