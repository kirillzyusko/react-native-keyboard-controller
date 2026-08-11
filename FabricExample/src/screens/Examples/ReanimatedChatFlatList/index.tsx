import { useHeaderHeight } from "@react-navigation/elements";
import React, { useRef } from "react";
import {
  FlatList,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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
  const {top} = useSafeAreaInsets();

  return (
    <View edges={["top"]} style={[styles.container, {paddingTop: top}]}>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior="translate-with-padding"
          keyboardVerticalOffset={headerHeight + top}
          style={styles.container}
          testID="flat-list.container"
        >
          <FlatList
            ref={ref}
            inverted
            onScroll={Keyboard.dismiss}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.contentContainer}
            data={reversedMessages}
            initialNumToRender={15}
            renderItem={RenderItem}
            testID="flat-list.chat"
          />
          <TextInput style={styles.textInput} testID="flat-list.input" />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

export default ReanimatedChatFlatList;
