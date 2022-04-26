import React, { FC, useCallback } from 'react';
import { Pressable, Text, Touchable, View } from 'react-native';
import type { Example } from '../../types';
import type { ScreenNames } from '../../../../../constants/screenNames';
import styles from './styles';

type Props = {
  onPress: (info: ScreenNames) => void;
  index: number;
} & Example;

const ExampleLink: FC<Props> = (props) => {
  const { onPress, title, info, icons, index } = props;

  const onCardPress = useCallback(() => onPress(info), [onPress]);

  return (
    <Pressable
      onPress={onCardPress}
      android_ripple={{ color: 'black' }}
      style={styles.container}
    >
      <View style={styles.row}>
        <Text>
          {index}. {title}
        </Text>
        <Text>{icons}</Text>
      </View>
    </Pressable>
  );
};

export default ExampleLink;
