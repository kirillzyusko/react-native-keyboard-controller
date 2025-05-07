import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";
import { KeyboardAvoidingView, KeyboardEvents } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type { MessageProps } from "../../../components/Message/types";
import type { ListRenderItem } from "react-native";

const reversedMessages = [...history].reverse();

const RenderItem: ListRenderItem<MessageProps> = ({ item, index }) => {
  return <Message key={index} {...item} />;
};

function ChatFlatList() {
  const translation = useAnimatedValue(0);
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    KeyboardEvents.addListener("keyboardWillShow", (e) => {
      Animated.timing(translation, {
        toValue: -e.height,
        duration: e.duration,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    });
    KeyboardEvents.addListener("keyboardWillHide", (e) => {
      Animated.timing(translation, {
        toValue: 0,
        duration: e.duration,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    });
  }, [translation]);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: "#3A3A3C", overflow: "hidden" }}
    >
      <View style={{ flex: 1, overflow: "hidden" }}>
        <Animated.View style={[styles.container, { transform: [{ translateY: translation }] }]}>
          <FlatList
            inverted
            contentContainerStyle={styles.contentContainer}
            data={reversedMessages}
            initialNumToRender={15}
            renderItem={RenderItem}
            testID="flat-list.chat"
          />
          <TextInput style={styles.textInput} testID="flat-list.input" />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

export default ChatFlatList;
