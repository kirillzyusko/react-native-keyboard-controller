import React, { useCallback, useRef, useState } from 'react';
import { Button, InputAccessoryView, Modal, TextInput, View } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import styles from './styles';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const inputAccessoryViewID = 'uniqueID';

const useKeyboardAnimation = () => {
  const progress = useSharedValue(0);
  const height = useSharedValue(0);
  const shouldUseOnMoveHandler = useSharedValue(false);
  useKeyboardHandler({
    onStart: (e) => {
      'worklet';

      // i. e. the keyboard was under interactive gesture, and will be showed
      // again. Since iOS will not schedule layout animation for that we can't
      // simply update `height` to destination and we need to listen to `onMove`
      // handler to have a smooth animation
      if (progress.value !== 1 && progress.value !== 0 && e.height !== 0) {
        shouldUseOnMoveHandler.value = true;
        return;
      }

      progress.value = e.progress;
      height.value = e.height;
    },
    onInteractive: (e) => {
      'worklet';

      console.log(e);

      progress.value = e.progress;
      height.value = e.height;
    },
    onMove: (e) => {
      'worklet';

      if (shouldUseOnMoveHandler.value) {
        progress.value = e.progress;
        height.value = e.height;
      }
    },
    onEnd: (e) => {
      'worklet';

      height.value = e.height;
      progress.value = e.progress;
      shouldUseOnMoveHandler.value = false;
    },
  });

  return { height, progress };
};

const TEXT_INPUT_HEIGHT = 50;

const contentContainerStyle = {
  paddingBottom: TEXT_INPUT_HEIGHT,
};

function InteractiveKeyboard() {
  const ref = useRef<Reanimated.ScrollView>(null);
  const { height } = useKeyboardAnimation();
  const [visible, setVisible] = useState(false);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollToEnd({ animated: false });
  }, []);

  const textInputStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      height: TEXT_INPUT_HEIGHT,
      width: '100%',
      backgroundColor: '#BCBCBC',
      transform: [{ translateY: -height.value }],
    }),
    []
  );

  return (
    <View style={styles.container}>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setVisible(false)}
      >
        <TextInput
          style={{
            marginTop: 40,
            width: '100%',
            height: 50,
            backgroundColor: 'green',
          }}
        />
      </Modal>
      <Button title="toggle" onPress={() => setVisible((v) => !v)} />
      <Reanimated.ScrollView
        ref={ref}
        onContentSizeChange={scrollToBottom}
        contentContainerStyle={contentContainerStyle}
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
      >
        {history.map((message, index) => (
          <Message key={index} {...message} />
        ))}
      </Reanimated.ScrollView>
      <AnimatedTextInput inputAccessoryViewID={inputAccessoryViewID} style={textInputStyle} />
      {/*<InputAccessoryView nativeID={inputAccessoryViewID}>
        <View style={{backgroundColor: 'green', width: 50, height: 20}} />
        </InputAccessoryView>*/}
    </View>
  );
}

export default InteractiveKeyboard;
