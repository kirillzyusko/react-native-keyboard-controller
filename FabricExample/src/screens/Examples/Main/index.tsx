import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import ExampleLink from "./components/ExampleLink";
import { examples } from "./constants";

import type { ScreenNames } from "../../../constants/screenNames";
import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});

type Props = NativeStackScreenProps<ParamListBase>;

const ExampleMain = ({ navigation }: Props) => {
  const onExamplePress = useCallback(
    (info: ScreenNames) => navigation.navigate<string>(info),
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
