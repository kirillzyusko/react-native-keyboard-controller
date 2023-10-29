import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, TextInput, View, Text, Button } from 'react-native';
import { useResizeMode, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { randomColor } from '../../../utils';

import KeyboardAwareScrollView from '../../../components/AwareScrollView';
import { styles } from './styles';

export default function AwareScrollViewStickyFooter() {
  useResizeMode();

  const { bottom } = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);

  const handleLayout = useCallback((evt: LayoutChangeEvent) => {
    setFooterHeight(evt.nativeEvent.layout.height);
  }, []);

  return (
    <View style={[styles.pageContainer, { paddingBottom: bottom }]}>
      <KeyboardAwareScrollView
        style={styles.container}
        bottomOffset={footerHeight + 50}
        keyboardShouldPersistTaps="handled"
      >
        {new Array(10).fill(0).map((_, i) => (
          <TextInput
            key={i}
            placeholder={`${i}`}
            placeholderTextColor="black"
            keyboardType={i % 2 === 0 ? 'numeric' : 'default'}
            style={{
              width: '100%',
              height: 50,
              backgroundColor: randomColor(),
              marginTop: 50,
            }}
          />
        ))}
      </KeyboardAwareScrollView>
      {/*<KeyboardStickyView
        offset={{closed: 0, opened: bottom }}
      >
        <View onLayout={handleLayout} style={styles.footer}>
          <Text style={styles.footerText}>A mocked sticky footer</Text>
          <Button title="Click me" />
        </View>
          </KeyboardStickyView>*/}
      <KeyboardStickyView offset={{closed: -50, opened: bottom - 25}}>
        <View style={{position: 'absolute', bottom: 0, right: 30, justifyContent: "flex-end", width: 60, height: 60, borderRadius: 30, backgroundColor: "#002099"}} />
      </KeyboardStickyView>
    </View>
  );
}
