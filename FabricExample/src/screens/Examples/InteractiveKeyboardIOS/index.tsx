import React, { useCallback, useRef, useState } from "react";
import { Platform, TextInput, View } from "react-native";
import {
  KeyboardGestureArea,
  KeyboardStickyView,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedProps,
  useAnimatedRef, // +
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  scrollTo,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type { LayoutChangeEvent } from "react-native";

const OS = Platform.OS;

const useKeyboardAnimation = () => {
  const animatedRef = useAnimatedRef();
  const translateY = useSharedValue(0);
  const padding = useSharedValue(0);
  const height = useSharedValue(0);
  const scroll = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";

        console.log("onStart", e);

        translateY.value = e.height;

        if (e.height === 0) {
          const delta = -padding.value;

          padding.value = e.height;
          // scrollTo(animatedRef, 0, scroll.value + delta, false); // + Adjust instantly
        }
      },
      onInteractive: (e) => {
        "worklet";

        console.log("onInteractive", e);

        height.value = e.height;
      },
      onMove: (e) => {
        "worklet";

        console.log("onMove", e);

        if (OS !== "ios") {
          translateY.value = e.height;
        }
      },
      onEnd: (e) => {
        "worklet";

        console.log("onEnd", e);

        if (e.height > 0) {
          padding.value = e.height;
          // scrollTo(animatedRef, 0, scroll.value + e.height, false); // + Adjust instantly
        }

        height.value = e.height;
      },
    },
    [],
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scroll.value = e.contentOffset.y;
    },
  });

  return {
    onScroll,
    translateY,
    padding,
    animatedRef,
  };
};

const TEXT_INPUT_HEIGHT = 50;

const contentContainerStyle = {
  paddingBottom: TEXT_INPUT_HEIGHT,
};

function InteractiveKeyboard() {
  const { onScroll, translateY, padding, animatedRef } = useKeyboardAnimation();
  const {bottom} = useSafeAreaInsets();
  const [inputHeight, setInputHeight] = useState(TEXT_INPUT_HEIGHT);
  const [text, setText] = useState("");

  const onInputLayoutChanged = useCallback((e: LayoutChangeEvent) => {
    setInputHeight(e.nativeEvent.layout.height);
  }, []);

  const scrollToBottom = useCallback(() => {
    // animatedRef.current?.scrollToEnd({ animated: false }); // Измени ref
  }, []);

  const s = useAnimatedStyle(
    () => ({
      // TODO: causes flickering on iOS randomly
      // marginTop: padding.value,
      transform: [{ translateY: -translateY.value }],
    }),
    [],
  );
  const v = useAnimatedStyle(() => ({ paddingTop: padding.value }), []); // + Измени paddingTop на height (чтобы spacer работал)

  // TODO: try to change contentOffset via animated props
  const animatedProps = useAnimatedProps(
    () => ({
      contentOffset: {
        x: 0,
        y: padding.value,
      },
    }),
    [bottom],
  );

  return (
    <View style={styles.container}>
      <Reanimated.ScrollView
        ref={animatedRef}
        animatedProps={animatedProps}
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={contentContainerStyle}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="interactive"
        testID="chat.scroll"
        // onContentSizeChange={scrollToBottom}
        style={v}
        onScroll={onScroll}
      >
        <Reanimated.View style={s}>
          {history.map((message, index) => (
            <Message key={index} {...message} />
          ))}
        </Reanimated.View>
      </Reanimated.ScrollView>
      <KeyboardStickyView
        style={{
          position: "absolute",
          width: "100%",
          minHeight: TEXT_INPUT_HEIGHT,
        }}
      >
        <TextInput
          multiline
          nativeID="chat-input"
          style={{
            flex: 1,
            backgroundColor: "#BCBCBC",
          }}
          testID="chat.input"
          value={text}
          onChangeText={setText}
          onLayout={onInputLayoutChanged}
        />
      </KeyboardStickyView>
    </View>
  );
}

export default InteractiveKeyboard;
