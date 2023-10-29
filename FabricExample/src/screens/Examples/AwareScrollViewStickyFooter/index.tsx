import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, View, Text, Button } from 'react-native';
import { useResizeMode, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import KeyboardAwareScrollView from '../../../components/AwareScrollView';
import TextInput from '../../../components/TextInput';
import { styles } from './styles';

export default function AwareScrollViewStickyFooter() {
  useResizeMode();

  const { bottom } = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);

  const handleLayout = useCallback((evt: LayoutChangeEvent) => {
    setFooterHeight(evt.nativeEvent.layout.height);
  }, []);
  const offset = useMemo(() => ({closed: 0, opened: bottom }), [bottom]);

  return (
    <View style={[styles.pageContainer, { paddingBottom: bottom }]}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        bottomOffset={footerHeight + 50}
        keyboardShouldPersistTaps="handled"
      >
        {new Array(10).fill(0).map((_, i) => (
          <TextInput
            key={i}
            placeholder={`TextInput#${i}`}
            keyboardType={i % 2 === 0 ? 'numeric' : 'default'}
          />
        ))}
      </KeyboardAwareScrollView>
      <KeyboardStickyView offset={offset}>
        <View onLayout={handleLayout} style={styles.footer}>
          <Text style={styles.footerText}>A mocked sticky footer</Text>
          <Button title="Click me" />
        </View>
          </KeyboardStickyView>
      {/*<KeyboardStickyView offset={{closed: -50, opened: bottom - 25}}>
        <View style={{position: 'absolute', bottom: 0, right: 30, justifyContent: "flex-end", width: 60, height: 60, borderRadius: 30, backgroundColor: "#002099"}} />
          </KeyboardStickyView>*/}
    </View>
  );
}
