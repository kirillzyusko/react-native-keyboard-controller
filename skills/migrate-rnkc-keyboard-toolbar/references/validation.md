# KeyboardToolbar Migration Validation

## Static checks

- Search the migrated scope for `content`, `blur`, `doneText`, `button`, `icon`, `showArrows`, `onNextCallback`, `onPrevCallback`, and `onDoneCallback` passed to `KeyboardToolbar`.
- Check local wrapper prop types and object spreads, not only direct JSX.
- Confirm every child detected by `React.Children` is an actual compound element, not a fragment or wrapper component.
- Confirm root-only props stayed on `KeyboardToolbar`.
- Confirm custom button and icon props were copied to every control that inherited them before.
- Run TypeScript and lint checks available in the application.

## Behavior checks

1. Focus the first input: previous is disabled and next reflects the next reachable input.
2. Move next through enabled inputs and verify disabled inputs are skipped.
3. Focus the last input: next is disabled.
4. Move previous and verify focus order matches the native view hierarchy.
5. Press done and verify keyboard dismissal and any callback side effect.
6. Verify a callback without `preventDefault()` still performs the built-in action.
7. Verify an intentional `preventDefault()` path suppresses the built-in action.
8. Toggle conditional arrows, content, background, and done controls.
9. Verify light and dark keyboard appearances with custom themes.
10. Verify landscape safe-area insets and rounded keyboard presentation where applicable.
11. Verify each `KeyboardToolbar.Group` boundary independently.

## RNKC repository checks

When working in the RNKC repository, use the existing toolbar example and focused E2E specification as behavioral references:

- `example/src/screens/Examples/Toolbar/index.tsx`
- `FabricExample/src/screens/Examples/Toolbar/index.tsx`
- `e2e/kit/005-keyboard-toolbar.e2e.ts`

Do not update snapshots merely to hide an unexplained toolbar difference.
