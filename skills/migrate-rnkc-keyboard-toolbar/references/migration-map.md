# KeyboardToolbar Migration Map

## Prop mapping

| Legacy prop or behavior                                | Compound API                               | Notes                                                                                         |
| ------------------------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Empty `KeyboardToolbar`                                | Direct `Prev`, `Next`, and `Done` children | Recreate all three defaults explicitly                                                        |
| `content={node}`                                       | `KeyboardToolbar.Content`                  | Put `node` inside the child                                                                   |
| `blur={node}`                                          | `KeyboardToolbar.Background`               | Use `Background`; there is no exported `KeyboardToolbar.Effect` in the current implementation |
| `doneText={node}`                                      | `KeyboardToolbar.Done text={node}`         | Omit `Done` when the old value intentionally hid it                                           |
| `showArrows={boolean}`                                 | Conditional `Prev` and `Next`              | Keep `Done` independently                                                                     |
| `onPrevCallback={fn}`                                  | `KeyboardToolbar.Prev onPress={fn}`        | Default previous focus still runs unless cancelled                                            |
| `onNextCallback={fn}`                                  | `KeyboardToolbar.Next onPress={fn}`        | Default next focus still runs unless cancelled                                                |
| `onDoneCallback={fn}`                                  | `KeyboardToolbar.Done onPress={fn}`        | Default dismissal still runs unless cancelled                                                 |
| Root `button={Button}`                                 | `button={Button}` on each rendered control | Apply to Prev, Next, and Done when all inherited it before                                    |
| Root `icon={Icon}`                                     | `icon={Icon}` on Prev and Next             | Done has text or children rather than arrow icon                                              |
| Root `theme`, `opacity`, `insets`, `offset`, `enabled` | Keep on root                               | These remain toolbar-level concerns                                                           |

The current type comment for legacy `blur` mentions `KeyboardToolbar.Effect`, but the runtime export and documentation use `KeyboardToolbar.Background`. Follow the runtime API.

## Complete migration

```tsx
// Before
<KeyboardToolbar
  blur={<BlurView style={StyleSheet.absoluteFill} />}
  button={ToolbarButton}
  content={<AutoFillContacts />}
  doneText="Close"
  icon={ToolbarArrow}
  insets={insets}
  onDoneCallback={onDone}
  onNextCallback={onNext}
  onPrevCallback={onPrev}
  opacity="4F"
  showArrows={showArrows}
/>

// After
<KeyboardToolbar insets={insets} opacity="4F">
  <KeyboardToolbar.Background>
    <BlurView style={StyleSheet.absoluteFill} />
  </KeyboardToolbar.Background>
  {showArrows ? (
    <KeyboardToolbar.Prev
      button={ToolbarButton}
      icon={ToolbarArrow}
      onPress={onPrev}
    />
  ) : null}
  {showArrows ? (
    <KeyboardToolbar.Next
      button={ToolbarButton}
      icon={ToolbarArrow}
      onPress={onNext}
    />
  ) : null}
  <KeyboardToolbar.Content>
    <AutoFillContacts />
  </KeyboardToolbar.Content>
  <KeyboardToolbar.Done
    button={ToolbarButton}
    text="Close"
    onPress={onDone}
  />
</KeyboardToolbar>
```

Set a non-opaque root `opacity` when the custom background must be visible through the toolbar's own background color.

## Custom children

Each button accepts custom `children`. Children replace the default arrow or done text:

```tsx
<KeyboardToolbar>
  <KeyboardToolbar.Prev>
    <MyPreviousIcon />
  </KeyboardToolbar.Prev>
  <KeyboardToolbar.Next>
    <MyNextIcon />
  </KeyboardToolbar.Next>
  <KeyboardToolbar.Done>Close</KeyboardToolbar.Done>
</KeyboardToolbar>
```

Prefer `icon` when one component already handles both `prev` and `next` arrow types. Prefer children when each control owns distinct UI. `Done` renders its child inside a React Native `Text`, so keep that child text-compatible; use a custom `button` component when the entire done control needs a different container.

## Callback semantics

The compound controls call the callback before the built-in action:

1. `Prev` callback, then `KeyboardController.setFocusTo("prev")`.
2. `Next` callback, then `KeyboardController.setFocusTo("next")`.
3. `Done` callback, then `KeyboardController.dismiss()`.

Calling `event.preventDefault()` suppresses the second step. Preserve this only when the application intentionally replaces the default behavior.

## Conditional done control

The old implementation did not render the done button when `doneText` was falsy. Preserve that intent explicitly:

```tsx
<KeyboardToolbar>
  <KeyboardToolbar.Prev />
  <KeyboardToolbar.Next />
  {showDone ? <KeyboardToolbar.Done text={doneLabel} /> : null}
</KeyboardToolbar>
```

## Input groups

Use `KeyboardToolbar.Group` around an input subtree only when previous and next navigation must stay within that subtree:

```tsx
<BottomSheet>
  <KeyboardToolbar.Group>
    <TextInput placeholder="First name" />
    <TextInput placeholder="Last name" />
  </KeyboardToolbar.Group>
</BottomSheet>
```

This changes focus reachability and button disabled states. It is a feature decision, not a mechanical part of legacy prop migration.

## Wrapper components and prop spreads

If an application wrapper accepts legacy props, migrate the wrapper contract and all call sites together. Do not forward deprecated props onto a toolbar that also receives children.

For unknown prop spreads:

```tsx
<KeyboardToolbar {...toolbarProps}>...</KeyboardToolbar>
```

inspect the type and runtime object. Split element-level legacy values from root-level values before spreading. A type-clean JSX surface can still carry deprecated keys through an untyped object.
