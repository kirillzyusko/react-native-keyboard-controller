import { ScreenNames } from '../../../constants/screenNames';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import ExampleLink from './components/ExampleLink';
import { examples } from './constants';
import { StyleSheet } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../navigation/RootStack';

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});

type Props = StackScreenProps<RootStackParamList>;

const ExampleMain = ({ navigation }: Props) => {
  const onExamplePress = useCallback(
    (info: ScreenNames) =>
      navigation.navigate(ScreenNames.EXAMPLES_STACK, { screen: info }),
    []
  );

  return (
    <ScrollView
      testID="main_scroll_view"
      contentContainerStyle={styles.scrollViewContainer}
    >
      {examples.map((example, index) => (
        <ExampleLink
          key={example.title}
          onPress={onExamplePress}
          index={index + 1}
          {...example}
        />
      ))}
    </ScrollView>
  );
};

export default ExampleMain;
