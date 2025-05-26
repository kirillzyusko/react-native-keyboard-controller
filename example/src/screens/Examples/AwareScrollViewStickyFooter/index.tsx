import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TextInput from "../../../components/TextInput";

import { styles } from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";
import { AvoidSoftInputView, useSoftInputHeightChanged } from "react-native-avoid-softinput";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

type Props = StackScreenProps<ExamplesStackParamList>;

const StickyFooterExample: React.FC = ({children}) => {
  const buttonContainerPaddingValue = useSharedValue(0);

  const buttonContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      bottom: Math.max(buttonContainerPaddingValue.value - 85, 0),
    };
  });
  useSoftInputHeightChanged(({ softInputHeight }) => {
    buttonContainerPaddingValue.value = withSpring(softInputHeight, {
      damping: 500,
      mass: 3,
      stiffness: 1000,
    });
  });

  return (
    <Animated.View style={[ buttonContainerAnimatedStyle, styles.ctaButtonWrapper ]}>
      {children}
    </Animated.View>
  );
}

export default function AwareScrollViewStickyFooter({ navigation }: Props) {
  const { bottom } = useSafeAreaInsets();

  const offsetV3 = useMemo(
    () => ({ opened: 80 }),
    [bottom],
  );

  return (
    <View
      style={[
        styles.pageContainer,
      ]}
    >
      <AvoidSoftInputView>
      <ScrollView
        bottomOffset={50}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        style={styles.container}
      >
          <TextInput
            title="Your Name"
            keyboardType="default"
            placeholder={`Type your name...`}
          />

          <TextInput
            title="Email"
            keyboardType="default"
            placeholder={`name@email.com`}
          />

          <TextInput
            title="Project"
            keyboardType="default"
            placeholder={""}
          />

          <TextInput
            title="Date"
            keyboardType="numeric"
            placeholder={"MM/DD/YYYY"}
          />

          <TextInput
            multiline
            title="Anything else"
            keyboardType="default"
            placeholder={"Tell us everything"}
            style={{minHeight: 200}}
          />
      </ScrollView>
      </AvoidSoftInputView>
      
      <StickyFooterExample>
        <View style={{backgroundColor: "#2F3036", paddingVertical: 20, position: "absolute", left: 0, right: 0, bottom: 0}}>
          <View style={{backgroundColor: "#006FFD", paddingVertical: 17, justifyContent: "center", alignItems: "center", marginHorizontal: 22, borderRadius: 8}}>
            <Text style={{color: "white", fontWeight: "700"}}>Submit</Text>
          </View>
        </View>
      </StickyFooterExample>
    </View>
  );
}
