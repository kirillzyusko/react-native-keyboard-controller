---
name: migrate-rnkc-keyboard-toolbar
description: Migrate React Native Keyboard Controller KeyboardToolbar usages from the legacy prop-based API to the compound component API while preserving focus navigation, dismissal, custom content, background effects, themes, safe-area insets, callbacks, accessibility, and conditional buttons. Use when code uses KeyboardToolbar content, blur, doneText, button, icon, showArrows, onNextCallback, onPrevCallback, or onDoneCallback props; when upgrading RNKC toolbar code; or when mixed legacy and compound APIs behave unexpectedly.
license: MIT
metadata:
  author: kirillzyusko
  source: react-native-keyboard-controller
---

# Migrate RNKC KeyboardToolbar

Convert each toolbar to direct compound children without changing its behavior. Inspect the installed RNKC version and every usage before editing. Do not mix legacy child-generating props with compound children.

Read [references/migration-map.md](references/migration-map.md) for exact mappings and edge cases. Read [references/validation.md](references/validation.md) before declaring the migration complete.

## Audit the requested scope

1. Find `KeyboardToolbar` imports, aliases, wrappers, prop spreads, and JSX usages.
2. Find deprecated props in local wrapper types as well as direct JSX.
3. Record the old rendered elements: previous, next, done, background, middle content, custom button, and custom icon.
4. Record conditional behavior, callback side effects, safe-area insets, theme, opacity, offset, and enabled state.
5. Check whether inputs should be isolated with `KeyboardToolbar.Group`.

Useful searches:

```sh
rg -n "KeyboardToolbar|content=|blur=|doneText=|showArrows=|onNextCallback=|onPrevCallback=|onDoneCallback=" src app
```

Adjust paths to the application. Do not search generated output or dependency caches unless the task asks for them.

## Rebuild the rendered toolbar explicitly

The old empty toolbar renders previous, next, and done controls by default:

```tsx
// Before
<KeyboardToolbar />

// After
<KeyboardToolbar>
  <KeyboardToolbar.Prev />
  <KeyboardToolbar.Next />
  <KeyboardToolbar.Done />
</KeyboardToolbar>
```

Keep non-deprecated root props such as `theme`, `opacity`, `insets`, `offset`, and `enabled` on `KeyboardToolbar`. Move element-specific behavior to direct children.

## Preserve default actions

`Prev`, `Next`, and `Done` call the provided `onPress` first, then perform their built-in action unless the event was cancelled:

```tsx
<KeyboardToolbar.Next
  onPress={(event) => {
    trackNext();

    if (useCustomNavigation) {
      event.preventDefault();
      focusCustomField();
    }
  }}
/>
```

Do not add `preventDefault()` merely because the old prop was named a callback. Legacy callbacks also ran alongside the default action.

## Keep compound children direct

Render `KeyboardToolbar.Background`, `.Content`, `.Prev`, `.Next`, and `.Done` as the elements passed directly to the toolbar. The toolbar identifies children by their component type. Do not hide them inside a fragment, wrapper component, or arbitrary container unless the installed implementation explicitly supports it. Arrays are flattened by `React.Children`, so an invoked helper may return an array of the actual compound elements; a wrapper such as `<ToolbarButtons />` is still opaque and will be ignored.

Conditional direct children are valid:

```tsx
<KeyboardToolbar>
  {showArrows ? <KeyboardToolbar.Prev /> : null}
  {showArrows ? <KeyboardToolbar.Next /> : null}
  <KeyboardToolbar.Done />
</KeyboardToolbar>
```

## Avoid partial migration

When `children` are present, the current implementation takes the compound branch and does not generate legacy `content`, `blur`, arrow, callback, button, icon, or done elements. Therefore this is unsafe:

```tsx
<KeyboardToolbar doneText="Close">
  <KeyboardToolbar.Content>...</KeyboardToolbar.Content>
</KeyboardToolbar>
```

Move every element-generating legacy prop in the same usage before committing it.

## Keep the change scoped

- Preserve the input view hierarchy unless the task explicitly changes focus order.
- Preserve `KeyboardAwareScrollView`, `KeyboardAvoidingView`, or other layout ownership around the toolbar.
- Do not add `KeyboardToolbar.Group` unless the intended focus boundary is clear.
- Preserve custom accessibility behavior in custom button components.
- Do not rewrite themes, icons, or callbacks beyond what the compound API requires.

## Verify and report

Run type checking and the most focused available tests. Manually verify first, middle, and last input states; disabled inputs; previous and next focus; done dismissal; conditional content; custom background; and grouped input boundaries. Report any behavior that could not be preserved automatically.
