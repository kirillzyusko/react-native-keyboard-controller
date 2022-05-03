import React from 'react';
import { useCallback } from 'react';
import { TextInput, View } from 'react-native';
import {
  useInteractiveKeyboardAnimation,
  InteractiveKeyboard,
  defaultLinearInterpolator,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Reanimated, {
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import styles from './styles';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

function InteractiveKeyboardExample() {
  const scrollView = useAnimatedRef<Reanimated.ScrollView>();
  const { handler } = useInteractiveKeyboardAnimation(
    defaultLinearInterpolator
  );
  const { height } = useReanimatedKeyboardAnimation();

  const scrollToBottom = useCallback(() => {
    scrollView.current?.scrollToEnd({ animated: false });
  }, []);

  const textInputStyle = useAnimatedStyle(
    () => ({
      height: 50,
      width: '100%',
      backgroundColor: '#CCCCCC',
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
      <InteractiveKeyboard handler={handler}>
        <Reanimated.ScrollView
          ref={scrollView}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          {history.map((message, index) => (
            <Message key={index} {...message} />
          ))}
          <Reanimated.View style={fakeView} />
        </Reanimated.ScrollView>
      </InteractiveKeyboard>
      <AnimatedTextInput style={textInputStyle} />
    </View>
  );
}

export default InteractiveKeyboardExample;
