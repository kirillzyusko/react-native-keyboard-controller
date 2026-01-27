import { useHeaderHeight } from "@react-navigation/elements";
import React, { useRef } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import Message from "../../../components/Message";
import { history } from "../../../components/Message/data";

import styles from "./styles";

import type { MessageProps } from "../../../components/Message/types";
import type { ListRenderItem } from "react-native";

const reversedMessages = [...history].reverse();

const RenderItem: ListRenderItem<MessageProps> = ({ item, index }) => {
  return <Message key={index} {...item} />;
};

function ReanimatedChatFlatList() {
  const headerHeight = useHeaderHeight();
  const ref = useRef<FlatList>(null);

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
        style={styles.container}
        testID="flat-list.container"
      >
        <FlatList
          ref={ref}
          inverted
          contentContainerStyle={styles.contentContainer}
          data={reversedMessages}
          initialNumToRender={15}
          renderItem={RenderItem}
          testID="flat-list.chat"
        />
        <TextInput style={styles.textInput} testID="flat-list.input" />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.fab}
          testID="flat-list.scrollToTop"
          onPress={() => ref.current?.scrollToEnd()}
        >
          <View style={styles.circle}>
            <Text style={styles.icon}>↑</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
}

export default ReanimatedChatFlatList;
