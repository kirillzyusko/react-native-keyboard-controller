import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import {
  KeyboardGestureArea,
  useKeyboardHandler,
} from 'react-native-keyboard-controller';
import Reanimated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import { ExamplesStackParamList } from '../../../navigation/ExamplesStack';
import styles from './styles';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const useKeyboardAnimation = ({ref, scroll}) => {
  const progress = useSharedValue(0);
  const height = useSharedValue(0);
  useKeyboardHandler({
    onMove: (e) => {
      'worklet';

      progress.value = e.progress;
      height.value = e.height;
    },
    onInteractive: (e) => {
      'worklet';

      scrollTo(ref, 0, scroll.value, false);

      progress.value = e.progress;
      height.value = e.height;
    },
  });

  return { height, progress };
};

type Props = StackScreenProps<ExamplesStackParamList>;

function InteractiveKeyboard({ navigation }: Props) {
  const aRef = useAnimatedRef();
  const scroll = useSharedValue(0);
  const [interpolator, setInterpolator] = useState<'ios' | 'linear'>('linear');
  const { height } = useKeyboardAnimation({ref: aRef, scroll: scroll});

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scroll.value = e.contentOffset.y;
    },
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.header}
          onPress={() =>
            setInterpolator(interpolator === 'ios' ? 'linear' : 'ios')
          }
        >
          {interpolator}
        </Text>
      ),
    });
  }, [interpolator]);

  const scrollViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -height.value }, ...styles.inverted.transform],
    }),
    []
  );
  const textInputStyle = useAnimatedStyle(
    () => ({
      height: 50,
      width: '100%',
      backgroundColor: '#BCBCBC',
      transform: [{ translateY: -height.value }],
    }),
    []
  );
  const fakeView = useAnimatedStyle(
    () => ({
      // TODO: don't update when onInteractive is fired
      // height: height.value,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <KeyboardGestureArea
        style={styles.content}
        interpolator={interpolator}
        showOnSwipeUp
      >
        <Reanimated.ScrollView
          ref={aRef}
          onScroll={onScroll}
          showsVerticalScrollIndicator={false}
          style={scrollViewStyle}
        >
          <View style={styles.inverted}>
            <Reanimated.View style={fakeView} />
            {history.map((message, index) => (
              <Message key={index} {...message} />
            ))}
          </View>
        </Reanimated.ScrollView>
      </KeyboardGestureArea>
      <AnimatedTextInput style={textInputStyle} />
    </View>
  );
}

export default InteractiveKeyboard;
