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
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.header}>Header</Text>
        <TextInput placeholder="Username" style={styles.textInput} />
        <View style={styles.btnContainer}>
          <Button title="Submit" onPress={() => null} />
        </View>
      </View>
    </Container>
  );
}
