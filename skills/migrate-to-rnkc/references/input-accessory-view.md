# Migrate React Native InputAccessoryView

Use this reference for `InputAccessoryView`, `inputAccessoryViewID`, and iOS-only keyboard accessory layouts.

Upstream API: https://reactnative.dev/docs/inputaccessoryview

Do not map every accessory to one RNKC component. Choose by what the content owns.

## Select the target

| Existing accessory intent                                        | RNKC target                                         | Why                                                |
| ---------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| Previous, next, and done form navigation                         | `KeyboardToolbar`                                   | Built-in focus and dismissal behavior              |
| Custom footer, composer, or action row that follows the keyboard | `KeyboardStickyView`                                | Translates app-owned content with the keyboard     |
| Non-input actions that should become part of the keyboard        | `KeyboardExtender`                                  | Extends the keyboard surface and height            |
| Menu, picker, or tooltip above the keyboard without dismissal    | `OverKeyboardView`                                  | Overlays the keyboard without changing focus       |
| Interactive dismissal or input-specific keyboard offset          | `KeyboardGestureArea` plus interactive scroll owner | Associates offset with matching input IDs          |
| Chat composer                                                    | `KeyboardStickyView` plus `KeyboardChatScrollView`  | Separates composer movement from message scrolling |

## Form toolbar migration

```tsx
<KeyboardToolbar>
  <KeyboardToolbar.Prev />
  <KeyboardToolbar.Next />
  <KeyboardToolbar.Content>
    <CustomAccessoryContent />
  </KeyboardToolbar.Content>
  <KeyboardToolbar.Done />
</KeyboardToolbar>
```

Use `$migrate-rnkc-keyboard-toolbar` if the target toolbar itself uses legacy props.

RNKC toolbar navigation follows the native view hierarchy. Verify input order and use `KeyboardToolbar.Group` only when focus must stay inside a subtree such as a bottom sheet.

## Sticky input or composer migration

When `InputAccessoryView` wraps a sticky `TextInput`, move that input back into the app hierarchy and wrap it with `KeyboardStickyView`:

```tsx
<View style={{ flex: 1 }}>
  <Content />
  <KeyboardStickyView offset={{ opened: bottomInset }}>
    <Composer />
  </KeyboardStickyView>
</View>
```

If the content above the composer is scrollable, choose the corresponding scroll owner. A chat should use `KeyboardChatScrollView`; a form may use `KeyboardAwareScrollView` or a bounded `KeyboardAvoidingView`.

## Keyboard extension migration

Use `KeyboardExtender` when the accessory should visually and structurally become part of the keyboard:

```tsx
<KeyboardExtender enabled={showActions}>
  <QuickActions />
</KeyboardExtender>
```

Do not place a `TextInput` inside `KeyboardExtender`. Use `KeyboardBackgroundView` plus `KeyboardStickyView` when the content needs to include an input while matching the keyboard appearance.

## Overlay migration

Use `OverKeyboardView` for an app-controlled overlay that must keep the keyboard open:

```tsx
<OverKeyboardView visible={showSuggestions}>
  <SuggestionPanel />
</OverKeyboardView>
```

It is a transparent full-screen overlay, not a drop-in `Modal` with presentation and animation props. Add custom Reanimated transitions and safe-area handling at the application layer if needed. It can operate without `KeyboardProvider` when used alone.

## Remove ID wiring carefully

After migration, remove `InputAccessoryView.nativeID` and `TextInput.inputAccessoryViewID` only when those IDs have no remaining purpose.

Do not remove `TextInput.nativeID` if it is reused by `KeyboardGestureArea.textInputNativeID`:

```tsx
<KeyboardGestureArea textInputNativeID="composer" offset={composerHeight}>
  <ScrollView keyboardDismissMode="interactive" />
  <TextInput nativeID="composer" />
</KeyboardGestureArea>
```

Multiple inputs can share the same `nativeID` when they intentionally share the gesture-area offset behavior.

## Preserve iOS behavior while adding Android

InputAccessoryView is iOS-specific; RNKC targets can be cross-platform. Do not assume Android should automatically receive the identical UI. Check product intent, system back behavior, keyboard appearance, and available screen space before enabling the new accessory on Android.

## Validate

- Focus every associated input and verify the correct accessory content.
- Verify multiline growth.
- Verify bottom tabs, safe areas, modals, and rotation.
- Verify keyboard dismissal and focus restoration after overlays.
- Verify hardware and floating keyboards.
- Verify iOS and Android separately.
- Search for leftover `InputAccessoryView`, `inputAccessoryViewID`, and obsolete native IDs.
