import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { TextInput } from 'react-native-gesture-handler';
// import { KeyboardEvents } from 'react-native-keyboard-controller';

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#3c3c3c',
  },
});

function EventsListener() {
  useEffect(() => {
    /*const show = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      Toast.show({
        type: 'info',
        text1: '⬆️ ⌨️ Keyboard will show',
        text2: `📲 Height: ${e.height}`,
      });
    });
    const shown = KeyboardEvents.addListener('keyboardDidShow', (e) => {
      Toast.show({
        type: 'success',
        text1: '⌨️ Keyboard is shown',
        text2: `👋 Height: ${e.height}`,
      });
    });
    const hide = KeyboardEvents.addListener('keyboardWillHide', (e) => {
      Toast.show({
        type: 'info',
        text1: '⬇️ ⌨️ Keyboard will hide',
        text2: `📲 Height: ${e.height}`,
      });
    });
    const hid = KeyboardEvents.addListener('keyboardDidHide', (e) => {
      Toast.show({
        type: 'error',
        text1: '⌨️ Keyboard is hidden',
        text2: `🤐 Height: ${e.height}`,
      });
    });

    return () => {
      show.remove();
      shown.remove();
      hide.remove();
      hid.remove();
    };*/
  }, []);

  return <TextInput style={styles.input} />;
}

export default function Events() {
  return (
    <>
      <EventsListener />
      <Toast />
    </>
  );
}
