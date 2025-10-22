import React, { useCallback, useEffect, useState } from "react";
import { Freeze } from "react-freeze";
import { StyleSheet, View } from "react-native";

import { KeyboardEvents } from "../../bindings";

// Incomplete type, all accessible properties available at:
// react-native/Libraries/Components/View/фReactNativeViewViewConfig.js
interface ViewConfig extends View {
  viewConfig: {
    validAttributes: {
      style: {
        display: boolean | null;
      };
    };
  };
  _viewConfig: {
    validAttributes: {
      style: {
        display: boolean | null;
      };
    };
  };
}

/**
 * A component that skips rendering its children when the keyboard is animating.
 * Skipping these updates can help to deliver smoother animations.
 *
 * @param props - Properties of the component.
 * @param props.children - Children of the component.
 * @returns Children that skips rendering while keyboard is animating.
 * @example
 * ```
 * <KeyboardAvoidingView behavior="padding">
 *   <KeyboardLayout>
 *     <FlatList />
 *   </KeyboardLayout>
 * </KeyboardAvoidingView>
 * ```
 */
const KeyboardLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [isFrozen, setFrozen] = useState(false);

  const handleRef = useCallback((ref: ViewConfig) => {
    // Workaround is necessary to prevent React Native from hiding frozen screens.
    // See this PR: https://github.com/grahammendick/navigation/pull/860
    if (ref?.viewConfig?.validAttributes?.style) {
      ref.viewConfig.validAttributes.style = {
        ...ref.viewConfig.validAttributes.style,
        display: null,
      };
    } else if (ref?._viewConfig?.validAttributes?.style) {
      ref._viewConfig.validAttributes.style = {
        ...ref._viewConfig.validAttributes.style,
        display: null,
      };
    }
  }, []);

  useEffect(() => {
    const willShowListener = KeyboardEvents.addListener(
      "keyboardWillShow",
      () => {
        setFrozen(true);
      },
    );
    const didHideListener = KeyboardEvents.addListener(
      "keyboardDidHide",
      () => {
        setFrozen(false);
      },
    );
    const willHideListener = KeyboardEvents.addListener(
      "keyboardWillHide",
      () => {
        setFrozen(true);
      },
    );
    const didShowListener = KeyboardEvents.addListener(
      "keyboardDidShow",
      () => {
        setFrozen(false);
      },
    );

    return () => {
      willShowListener.remove();
      didHideListener.remove();
      willHideListener.remove();
      didShowListener.remove();
    };
  }, []);

  return (
    <Freeze freeze={isFrozen}>
      <View ref={handleRef} style={styles.flex}>
        {children}
      </View>
    </Freeze>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default KeyboardLayout;
