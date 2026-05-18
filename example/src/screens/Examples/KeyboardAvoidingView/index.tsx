import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

import styles from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";
import type { KeyboardAvoidingViewProps } from "react-native";

type Props = StackScreenProps<ExamplesStackParamList>;

type Behavior = KeyboardAvoidingViewProps["behavior"];
const behaviors: Behavior[] = ["padding", "height", "position"];

export default function KeyboardAvoidingViewExample({ navigation }: Props) {
  const [behavior, setBehavior] = useState<Behavior>(behaviors[0]);
  const [isPackageImplementation, setPackageImplementation] = useState(false);

  const Container = RNKeyboardAvoidingView;

  return (
    <RNKeyboardAvoidingView
      behavior={behavior}
      contentContainerStyle={styles.container}
      style={{flex: 1}}
      testID="keyboard_avoiding_view.container"
    >
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome back!</Text>
        <View style={styles.inner}>
          <View style={styles.inputs}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#7C7C7C"
              style={styles.textInput}
              testID="keyboard_avoiding_view.username"
            />
            <TextInput
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#7C7C7C"
              style={styles.textInput}
              testID="keyboard_avoiding_view.password"
            />
          </View>
        </View>
        <>
          <TouchableOpacity
            style={styles.button}
            testID="keyboard_avoiding_view.submit"
          >
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
        </>
      </View>
    </RNKeyboardAvoidingView>
  );
}
