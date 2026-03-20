import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { ScreenNames } from "../../../constants/screenNames";

import ExampleLink from "./components/ExampleLink";
import { examples } from "./constants";

import type { RootStackParamList } from "../../../navigation/RootStack";
import type { StackScreenProps } from "@react-navigation/stack";

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
    [],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      testID="main_scroll_view"
    >
      {examples.map((example, index) => (
        <ExampleLink
          key={example.title}
          index={index + 1}
          onPress={onExamplePress}
          {...example}
        />
      ))}
    </ScrollView>
  );
};

export default ExampleMain;
