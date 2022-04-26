import { ScreenNames } from '../../../constants/screenNames';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import ExampleLink from './components/ExampleLink';
import { examples } from './constants';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});

const ExampleMain = ({ navigation }) => {
  const onExamplePress = useCallback(
    (info: ScreenNames) =>
      navigation.navigate(ScreenNames.EXAMPLES_STACK, { screen: info }),
    []
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      {examples.map((example, index) => (
        <ExampleLink onPress={onExamplePress} index={index + 1} {...example} />
      ))}
    </ScrollView>
  );
};

export default ExampleMain;
