import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import styles from "./styles";

import type { ScreenNames } from "../../../../../constants/screenNames";
import type { Example } from "../../types";
import type { FC } from "react";

type Props = {
  onPress: (info: ScreenNames) => void;
  index: number;
} & Example;

const ExampleLink: FC<Props> = (props) => {
  const { onPress, title, testID, info, icons, badge, index } = props;

  const onCardPress = useCallback(() => onPress(info), [onPress]);

  return (
    <TouchableOpacity
      style={styles.container}
      testID={testID}
      onPress={onCardPress}
    >
      <View style={styles.row}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {index}. {title}
          </Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.icons}>{icons}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExampleLink;
