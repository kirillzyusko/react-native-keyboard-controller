import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, TextInput, View, Text, Button } from 'react-native';
import { useResizeMode } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { randomColor } from '../../../utils';

import KeyboardAwareScrollView from './KeyboardAwareScrollView';
import { StickyFooter } from './StickyFooter';
import { styles } from './styles';

export default function AwareScrollViewStickyFooter() {
  useResizeMode();

  const { bottom } = useSafeAreaInsets();

  const [footerHeight, setFooterHeight] = useState(0);

  const handleLayout = useCallback((evt: LayoutChangeEvent) => {
    setFooterHeight(evt.nativeEvent.layout.height);
  }, []);

  return (
    <View style={[styles.pageContainer, { paddingBottom: footerHeight }]}>
      <KeyboardAwareScrollView
        style={styles.container}
        bottomOffset={footerHeight}
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
      <StickyFooter
        onLayout={handleLayout}
        bottomOffsetWhenKeyboardIsClosed={bottom}
      >
        <View style={styles.footer}>
          <Text style={styles.footerText}>A mocked sticky footer</Text>
          <Button title="Click me" />
        </View>
      </StickyFooter>
    </View>
  );
}
