import { FlatList, ListRenderItem, TextInput, View } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';

import { useCallback } from 'react';
import { MessageProps } from '../../../components/Message/types';
import styles from './styles';

function ReanimatedChatFlatlist() {
  const { height } = useReanimatedKeyboardAnimation();

  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    []
  );

  const renderItem: ListRenderItem<MessageProps> = useCallback(
    ({ item, index }) => {
      return <Message key={index} {...item} />;
    },
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        initialNumToRender={15}
        contentContainerStyle={styles.contentContainer}
        data={history.reverse()}
        renderItem={renderItem}
      />
      <TextInput style={styles.textInput} />
      <Animated.View style={[fakeView]} />
    </View>
  );
}

export default ReanimatedChatFlatlist;
