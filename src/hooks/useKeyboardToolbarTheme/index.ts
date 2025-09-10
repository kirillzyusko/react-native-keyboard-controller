import { useEffect, useState } from "react";
import { Appearance, type ColorSchemeName } from "react-native";

import { useKeyboardState } from "../useKeyboardState";

type ColorScheme = "light" | "dark";

/**
 * Hook that provides the correct theme for the keyboard toolbar.
 * Falls back to system appearance for Android devices where keyboard
 * appearance detection may be unreliable.
 *
 * @returns The color scheme to use for the toolbar ("light" or "dark")
 */
export const useKeyboardToolbarTheme = (): ColorScheme => {
  const keyboardColorScheme = useKeyboardState((state) => state.appearance);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  // Use keyboard appearance if it's explicitly dark,
  // or if keyboard is light but system is dark (Android < API 29 fallback)
  if (keyboardColorScheme === "dark") {
    return "dark";
  }

  if (keyboardColorScheme === "light" && systemColorScheme === "dark") {
    return "dark";
  }

  return "light";
};
