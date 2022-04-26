import React from 'react';
import { TextInput, View } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import Message from './components/Message';
import { history } from './constants';
import styles from './styles';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

function ReanimatedChat() {
  const { height } = useReanimatedKeyboardAnimation();

  const scrollViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: height.value }],
    }),
    []
  );
  const textInputStyle = useAnimatedStyle(
    () => ({
      height: 50,
      width: '100%',
      backgroundColor: '#ECECEC',
      transform: [{ translateY: height.value }],
    }),
    []
  );

  return (
    <View style={styles.container}>
      <Reanimated.ScrollView style={scrollViewStyle}>
        {history.map((message, index) => (
          <Message key={index} {...message} />
        ))}
      </Reanimated.ScrollView>
      <AnimatedTextInput style={textInputStyle} />
    </View>
  );
}

export default ReanimatedChat;
