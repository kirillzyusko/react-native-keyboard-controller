import React from 'react';
import { FlatList, ListRenderItem, TextInput, View } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useAnimatedStyle } from 'react-native-reanimated';

import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';

import type { StackScreenProps } from '@react-navigation/stack';
import Animated from 'react-native-reanimated';
import { MessageProps } from '../../../components/Message/types';
import type { ExamplesStackParamList } from '../../../navigation/ExamplesStack';
import styles from './styles';

type Props = StackScreenProps<ExamplesStackParamList>;

function ReanimatedChatFlatlist({ navigation }: Props) {
  const { height } = useReanimatedKeyboardAnimation();

  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    []
  );

  const renderItem: ListRenderItem<MessageProps> = ({ item, index }) => {
    return <Message key={index} {...item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        initialNumToRender={15}
        contentContainerStyle={styles.contentContainer}
        data={history}
        renderItem={renderItem}
      />
      <TextInput style={styles.textInput} />
      <Animated.View style={[fakeView]} />
    </View>
  );
}

export default ReanimatedChatFlatlist;
