import React from 'react';
import { FlatList, ListRenderItem, TextInput, View } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import { MessageProps } from '../../../components/Message/types';

import styles from './styles';

const reversedMessages = [...history].reverse();

const RenderItem: ListRenderItem<MessageProps> = ({ item, index }) => {
  return <Message key={index} {...item} />;
};

function ReanimatedChatFlatlist() {
  const { height } = useReanimatedKeyboardAnimation();

  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        initialNumToRender={15}
        contentContainerStyle={styles.contentContainer}
        data={reversedMessages}
        renderItem={RenderItem}
      />
      <TextInput style={styles.textInput} />
      <Animated.View style={fakeView} />
    </View>
  );
}

export default ReanimatedChatFlatlist;
