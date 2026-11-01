# Migrate Android Soft-Input Mode Ownership

Use this reference for `android:windowSoftInputMode`, Expo `softwareKeyboardLayoutMode`, `KeyboardController.setInputMode`, `adjustPan`, `adjustResize`, `adjustNothing`, and navigation-scoped input-mode hooks.

Android edge-to-edge guidance: https://developer.android.com/develop/ui/compose/system/setup-e2e

RNKC platform model: https://kirillzyusko.github.io/react-native-keyboard-controller/docs/recipes/platform-differences

## Understand RNKC's Android model

RNKC uses its controller view to enter edge-to-edge, receives IME inset animation frames, and expects `adjustResize` for compatible keyboard frame delivery. In edge-to-edge, `adjustResize` does not mean the old non-edge-to-edge window-resize behavior; the application handles keyboard movement through RNKC.

Do not preserve `adjustPan` from another library merely because it was previously required. APSL's documented enhanced Android mode uses `adjustPan`; RNKC uses a different ownership model.

## Find every owner

Inspect:

- the main activity in `AndroidManifest.xml` and manifest overlays;
- Expo `app.json`, `app.config.*`, and build-property plugins;
- `KeyboardController.setInputMode` and `setDefaultMode` calls;
- `useKeyboardAnimation`, `useReanimatedKeyboardAnimation`, and `useKeyboardHandler` mounts;
- custom hooks using navigation focus lifecycle;
- bottom-sheet, edge-to-edge, status-bar, and navigation libraries;
- calls that enable or disable RNKC dynamically.

Choose one policy and remove competing owners.

## Policy A: global adjustResize

Use when the whole application uses RNKC-compatible keyboard handling:

```xml
<activity
  android:name=".MainActivity"
  android:windowSoftInputMode="adjustResize" />
```

For Expo, configure the installed Expo version's `softwareKeyboardLayoutMode` equivalent to resize and regenerate/rebuild native projects as required. Verify the generated manifest rather than assuming the config was applied.

With global `adjustResize`, low-level custom handlers can use `useGenericKeyboardHandler` when they intentionally do not want mount-time mode changes. Prebuilt components and standard hooks may still use the package's resize-mode helper; inspect the installed version before replacing internals.

## Policy B: RNKC screen-scoped mount lifecycle

Standard RNKC animation hooks call `useResizeMode`, which sets `adjustResize` on mount and restores the manifest default on unmount. This is appropriate when the component unmounts with the screen and no other mounted screen competes for the mode.

Do not add redundant imperative mode calls around a hook that already owns them.

## Policy C: navigation focus lifecycle

React Navigation commonly keeps previous screens mounted. If only the focused screen should use RNKC input mode, use focus lifecycle and consume context values without a second mount-scoped mode owner:

```tsx
function useFocusedKeyboardAnimation() {
  useFocusEffect(
    useCallback(() => {
      KeyboardController.setInputMode(
        AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,
      );

      return () => KeyboardController.setDefaultMode();
    }, []),
  );

  return useKeyboardContext().reanimated;
}
```

Adapt the returned Animated or Reanimated context to the consumer. Do not call `useReanimatedKeyboardAnimation` inside this custom hook as well, because it adds mount-scoped mode ownership.

## Restore the declared default

`KeyboardController.setDefaultMode()` restores the manifest or generated application default. Verify that default is intentional. If the manifest still says `adjustPan` from the old library, restoration can reintroduce old behavior after leaving an RNKC screen.

## Edge-to-edge and system bars

Review `KeyboardProvider` props when another library controls system bars:

- `statusBarTranslucent`
- `navigationBarTranslucent`
- `preserveEdgeToEdge`

RNKC integrates with `react-native-is-edge-to-edge` and detects common edge-to-edge ownership. Do not add duplicate status-bar padding to compensate for a configuration misunderstanding.

## Dynamic enablement

Disabling RNKC returns the screen toward default Android behavior. Use `useKeyboardController().setEnabled` only when the product intentionally switches ownership; do not toggle the module as a substitute for choosing the correct screen component.

## Avoid unsafe patterns

- Do not change soft-input mode during render.
- Do not let multiple mounted screens set and restore different modes without a clear stack policy.
- Do not mix `adjustPan` layout movement with RNKC translation for the same screen.
- Do not assume a JavaScript config change is active before rebuilding the native app.
- Do not globally change the manifest when the user asked for a narrow screen migration without explaining the scope expansion.

## Validate on Android

- Inspect the merged or generated manifest.
- Cold launch after native rebuild.
- Open and close the keyboard on migrated and non-migrated screens.
- Navigate between screens that stay mounted.
- Test Android back dismissal and interactive dismissal where supported.
- Verify status and navigation bar insets in gesture and three-button navigation.
- Test API levels below and above Android 11 when interactive behavior matters.
- Verify module disable and re-enable only if the app uses it.
