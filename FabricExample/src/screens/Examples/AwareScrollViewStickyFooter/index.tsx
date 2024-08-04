import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Text, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TextInput from "../../../components/TextInput";

import { styles } from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";
import type { LayoutChangeEvent } from "react-native";

type Props = StackScreenProps<ExamplesStackParamList>;

const variants = ["v1", "v2", "v3"] as const;

type Variant = (typeof variants)[number];

export default function AwareScrollViewStickyFooter({ navigation }: Props) {
  const { bottom } = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const [variant, setVariant] = useState<Variant>("v1");

  const handleLayout = useCallback((evt: LayoutChangeEvent) => {
    setFooterHeight(evt.nativeEvent.layout.height);
  }, []);
  const offset = useMemo(
    () => ({ closed: 0, opened: variant === "v1" ? 0 : bottom }),
    [bottom, variant],
  );
  const offsetV3 = useMemo(
    () => ({ closed: -50, opened: bottom - 25 }),
    [bottom],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.header}
          onPress={() => {
            const index = variants.indexOf(variant);

            setVariant(variants[index === variants.length - 1 ? 0 : index + 1]);
          }}
        >
          {variant}
        </Text>
      ),
    });
  }, [variant]);

  const v1v2 = variant === "v1" || variant === "v2";

  return (
    <View
      style={[
        styles.pageContainer,
        { paddingBottom: variant === "v1" ? 0 : bottom },
      ]}
    >
      <KeyboardAwareScrollView
        bottomOffset={(v1v2 ? footerHeight : 0) + 50}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        style={styles.container}
      >
        {new Array(10).fill(0).map((_, i) => (
          <TextInput
            key={i}
            keyboardType={i % 2 === 0 ? "numeric" : "default"}
            placeholder={`TextInput#${i}`}
          />
        ))}
      </KeyboardAwareScrollView>
      {v1v2 && (
        <KeyboardStickyView offset={offset}>
          <View style={styles.footer} onLayout={handleLayout}>
            <Text style={styles.footerText}>A mocked sticky footer</Text>
            <TextInput placeholder="Amount" style={styles.inputInFooter} />
            <Button title="Click me" />
          </View>
        </KeyboardStickyView>
      )}
      {variant === "v3" && (
        <KeyboardStickyView offset={offsetV3}>
          <View style={styles.circle} />
        </KeyboardStickyView>
      )}
    </View>
  );
}
