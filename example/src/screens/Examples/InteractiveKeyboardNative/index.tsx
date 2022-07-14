import React from 'react';
import { useCallback } from 'react';
import { TextInput, View } from 'react-native';
import {
  useReanimatedKeyboardAnimation,
  KeyboardGestureArea,
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
      <KeyboardGestureArea>
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
      </KeyboardGestureArea>
      <KeyboardGestureArea>
      <AnimatedTextInput style={textInputStyle} />
      </KeyboardGestureArea>
    </View>
  );
}

export default InteractiveKeyboardExample;
