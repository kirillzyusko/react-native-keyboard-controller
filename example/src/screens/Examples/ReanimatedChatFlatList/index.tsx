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
import { SafeAreaView } from "react-native-safe-area-context";

const reversedMessages = [...history].reverse();

const RenderItem: ListRenderItem<MessageProps> = ({ item, index }) => {
  return <Message key={index} {...item} />;
};

function ReanimatedChatFlatList() {
  const headerHeight = useHeaderHeight();
  const ref = useRef<FlatList>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#3A3A3C", overflow: "hidden" }} edges={["top"]}>
      <View style={{flex: 1, overflow: "hidden"}}>
      <KeyboardAvoidingView
        behavior="translate-with-padding"
        keyboardVerticalOffset={64}
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
        </KeyboardAvoidingView>
        </View>
    </SafeAreaView>
  );
}

export default ReanimatedChatFlatList;
