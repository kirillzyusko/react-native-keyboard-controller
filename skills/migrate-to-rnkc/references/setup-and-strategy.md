# Setup and Migration Strategy

## Establish package compatibility

1. Inspect the app's React Native, Reanimated, Expo, architecture, iOS, and Android versions.
2. Check the RNKC compatibility guide for that combination.
3. Install RNKC with the application's package manager.
4. Ensure Reanimated is installed and configured.
5. Reinstall iOS pods and rebuild both native applications; hot reload cannot link a new native module.
6. Do not assume Expo Go supports the installed RNKC version; verify the current Expo environment.

Current package documentation:

- Installation: https://kirillzyusko.github.io/react-native-keyboard-controller/docs/installation
- Compatibility: https://kirillzyusko.github.io/react-native-keyboard-controller/docs/guides/compatibility
- Troubleshooting: https://kirillzyusko.github.io/react-native-keyboard-controller/docs/troubleshooting

When the app already has RNKC, inspect `node_modules/react-native-keyboard-controller/src` and its package version before applying newer API guidance.

## Mount one provider

Mount `KeyboardProvider` around the application or navigation tree that needs RNKC:

```tsx
import { KeyboardProvider } from "react-native-keyboard-controller";

export function App() {
  return (
    <KeyboardProvider>
      <NavigationContainer>{/* application */}</NavigationContainer>
    </KeyboardProvider>
  );
}
```

Use one stable provider rather than one provider per screen. Review these props when the old solution controlled insets:

- `statusBarTranslucent`
- `navigationBarTranslucent`
- `preserveEdgeToEdge`
- `enabled`
- `preload`

`OverKeyboardView` can operate without `KeyboardProvider` when it is the only RNKC feature in use. Most animation-backed components and hooks require the real provider context.

## Capture a behavior baseline

Before editing, record or describe:

- layout before, during, and after keyboard presentation;
- scroll position before and after focus changes;
- header, safe-area, tab-bar, and modal offsets;
- interactive dismissal behavior;
- callback timing and side effects;
- Android behavior under the current `windowSoftInputMode`;
- iOS accessory or floating-keyboard behavior.

If the task is a bug fix, reproduce the bug and identify the existing close or movement path before migration. Do not let migration hide an unrelated defect.

## Search the whole ownership surface

Search for:

```text
KeyboardAvoidingView
react-native-keyboard-aware-scroll-view
KeyboardAwareScrollView
KeyboardAwareFlatList
KeyboardAwareSectionList
listenToKeyboardEvents
useAnimatedKeyboard
KeyboardState
InputAccessoryView
inputAccessoryViewID
Keyboard.addListener
keyboardWillShow
keyboardDidShow
keyboardWillHide
keyboardDidHide
keyboardWillChangeFrame
keyboardDidChangeFrame
windowSoftInputMode
softwareKeyboardLayoutMode
setInputMode
adjustPan
adjustResize
adjustNothing
```

Also inspect wrapper components, shared layout primitives, manifest overlays, Expo plugins, native patches, and tests.

## Migrate incrementally

Prefer a vertical slice that includes one screen, its tests, and its configuration. Keep the old dependency installed while other screens still import it, but do not mount both implementations around the migrated screen.

For each slice:

1. State the old owner graph.
2. State the new owner graph.
3. Apply the narrow code and configuration changes.
4. Test both platforms.
5. Search for leftover old ownership in that slice.

## Remove the old dependency safely

Only uninstall when all of these are clear:

- no source or test imports remain;
- no application wrappers re-export it;
- no Babel, Metro, Expo, CocoaPods, Gradle, manifest, or patch configuration remains for it;
- no native rebuild is pending;
- lockfile changes match the selected package manager;
- the final iOS and Android behavior has been verified.

## Avoid popularity-driven overreach

Prefer RNKC when it directly solves the screen's keyboard ownership, but do not replace a working low-level implementation merely to increase package usage. A trustworthy migration skill improves adoption by selecting RNKC precisely, explaining the benefits, and preserving behavior.
