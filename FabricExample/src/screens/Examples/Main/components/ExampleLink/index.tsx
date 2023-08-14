import React, { FC, useCallback } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
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
    <TouchableOpacity onPress={onCardPress} style={styles.container}>
      <View style={styles.row}>
        <Text>
          {index}. {title}
        </Text>
        <Text style={styles.text}>{icons}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExampleLink;
