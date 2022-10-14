import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';

import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import { useTelegramTransitions } from './hooks';
import styles from './styles';

import type { StackScreenProps } from '@react-navigation/stack';
import type { ExamplesStackParamList } from '../../../navigation/ExamplesStack';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

type Props = StackScreenProps<ExamplesStackParamList>;

function ReanimatedChat({ navigation }: Props) {
  const [isTGTransition, setTGTransition] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={{ marginRight: 12 }}
          onPress={() => setTGTransition((value) => !value)}
        >
          {`Switch to ${isTGTransition ? 'Platform' : 'Telegram'}`}
        </Text>
      ),
    });
  }, [isTGTransition]);

  const { height: telegram } = useTelegramTransitions();
  const { height: platform } = useReanimatedKeyboardAnimation();
  const height = isTGTransition ? telegram : platform;

  const scrollViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: height.value }, ...styles.inverted.transform],
    }),
    [isTGTransition]
  );
  const textInputStyle = useAnimatedStyle(
    () => ({
      height: 50,
      width: '100%',
      backgroundColor: '#BCBCBC',
      transform: [{ translateY: height.value }],
    }),
    [isTGTransition]
  );
  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    [isTGTransition]
  );

  return (
    <View style={styles.container}>
      <Reanimated.ScrollView
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
      <AnimatedTextInput style={textInputStyle} />
    </View>
  );
}

export default ReanimatedChat;
