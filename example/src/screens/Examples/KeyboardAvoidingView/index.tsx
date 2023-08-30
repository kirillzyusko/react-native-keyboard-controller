import React, { useState, useEffect } from 'react';
import {
  Button,
  Platform,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { StackScreenProps } from '@react-navigation/stack';
import { ExamplesStackParamList } from '../../../navigation/ExamplesStack';
import styles from './styles';

type Props = StackScreenProps<ExamplesStackParamList>;

export default function KeyboardAvoidingViewExample({ navigation }: Props) {
  const [isPackageImplementation, setPackageImplementation] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.header}
          onPress={() => setPackageImplementation((value) => !value)}
        >
          {`${isPackageImplementation ? 'Package' : 'RN'}`}
        </Text>
      ),
    });
  }, [isPackageImplementation]);

  const Container = isPackageImplementation
    ? KeyboardAvoidingView
    : RNKeyboardAvoidingView;

  return (
    <Container
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      contentContainerStyle={styles.container}
      keyboardVerticalOffset={50}
      style={[styles.content, { backgroundColor: 'red' }]}
    >
      <View style={[styles.inner, { backgroundColor: 'yellow' }]}>
        <Text style={[styles.heading, { backgroundColor: 'blue' }]}>
          Header
        </Text>
        <TextInput
          placeholder="Username"
          style={[styles.textInput, { backgroundColor: 'green' }]}
        />
        <View style={styles.btnContainer}>
          <Button title="Submit" onPress={() => null} />
        </View>
      </View>
    </Container>
  );
}
