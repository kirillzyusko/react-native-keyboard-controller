import React, { useCallback } from 'react';
import { TextInput, View } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Reanimated, {
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import styles from './styles';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

function ReanimatedChat() {
  const scrollView = useAnimatedRef<Reanimated.ScrollView>();
  const { height } = useReanimatedKeyboardAnimation();

  const scrollToBottom = useCallback(() => {
    scrollView.current?.scrollToEnd({ animated: false });
  }, []);

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
  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    []
  );

  return (
    <View style={styles.container}>
      <Reanimated.ScrollView
        ref={scrollView}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
        style={scrollViewStyle}
      >
        <Reanimated.View style={fakeView} />
        {history.map((message, index) => (
          <Message key={index} {...message} />
        ))}
      </Reanimated.ScrollView>
      <AnimatedTextInput style={textInputStyle} />
    </View>
  );
}

export default ReanimatedChat;
