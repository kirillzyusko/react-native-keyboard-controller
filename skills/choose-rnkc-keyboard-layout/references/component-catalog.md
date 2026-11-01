# RNKC Component and Hook Catalog

Use this reference after inspecting the screen. Re-check the installed package types when a prop or platform capability may have changed.

## Quick decision matrix

| Requirement                                          | Primary API                                    | Combine with                                | Avoid as the primary owner                       |
| ---------------------------------------------------- | ---------------------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| Keep a bounded non-scroll layout visible             | `KeyboardAvoidingView`                         | `KeyboardToolbar`                           | Aware scroll view unless content needs scrolling |
| Reveal a focused input in a long form                | `KeyboardAwareScrollView`                      | `KeyboardToolbar`                           | Nested avoidance wrappers                        |
| Move one footer or composer                          | `KeyboardStickyView`                           | Normal content or chat scroll               | Resizing the entire screen                       |
| Build a chat message viewport                        | `KeyboardChatScrollView`                       | `KeyboardStickyView`, `KeyboardGestureArea` | General-purpose avoiding views                   |
| Navigate previous, next, and done                    | `KeyboardToolbar`                              | Form avoidance or aware scrolling           | Treating the toolbar as layout avoidance         |
| Interactively dismiss or apply input-specific offset | `KeyboardGestureArea`                          | Interactive scroll view                     | JS pan-to-keyboard synchronization               |
| Show a menu above an active keyboard                 | `OverKeyboardView`                             | Custom animation if needed                  | `Modal` when it dismisses the keyboard           |
| Add non-input actions to the keyboard                | `KeyboardExtender`                             | Selector for keyboard appearance            | Putting a `TextInput` inside it                  |
| Match the system keyboard background                 | `KeyboardBackgroundView`                       | `KeyboardStickyView`                        | Using it for layout or events                    |
| Replace what is visible behind the keyboard          | `KeyboardEffects`                              | Opaque view, gradient, or animation         | Expecting Android translucency behavior          |
| Animate with React Native Animated                   | `useKeyboardAnimation`                         | `Animated.View`                             | React state per frame                            |
| Animate with Reanimated                              | `useReanimatedKeyboardAnimation`               | `useAnimatedStyle`                          | Reanimated `useAnimatedKeyboard` alongside RNKC  |
| Handle keyboard lifecycle frames                     | `useKeyboardHandler`                           | Shared values and worklets                  | `Keyboard.addListener` for per-frame UI          |
| Render keyboard metadata                             | `useKeyboardState(selector)`                   | Leaf UI                                     | Full-state subscription in broad parents         |
| Read latest state inside a callback                  | `KeyboardController.state()` or `.isVisible()` | Imperative logic                            | A hook subscription used only by the callback    |

## `KeyboardAvoidingView`

Use for a bounded screen or panel whose layout should change as a unit.

- `behavior="padding"`: add bottom padding; suitable for flex layouts and simple embedded scroll views.
- `behavior="height"`: shrink the container.
- `behavior="position"`: reposition the inner content and use `contentContainerStyle` for that inner view.
- `behavior="translate-with-padding"`: translate while applying one-time padding for performance-sensitive layouts; do not choose it for a chat list without checking `KeyboardChatScrollView` first.
- `keyboardVerticalOffset`: compensate for known top positioning such as headers when `automaticOffset` is false.
- `automaticOffset`: measure screen position automatically; when true, `keyboardVerticalOffset` becomes additive rather than compensatory.

Use `enabled` when multiple mounted screens or conditional layouts exist, but first determine which mounted layer should own avoidance.

## `KeyboardAwareScrollView`

Use for forms with inputs that can move outside the visible scroll viewport.

- `bottomOffset`: desired distance between the keyboard and focused caret.
- `extraKeyboardSpace`: additional bottom keyboard space.
- `disableScrollOnKeyboardHide`: preserve scroll position when the keyboard closes.
- `mode="insets"`: default; extend the scrollable area without layout reflow.
- `mode="layout"`: append layout space so flex distribution, gaps, or `justifyContent: "space-between"` reflow.
- `ScrollViewComponent`: integrate a custom scroll implementation.
- `assureFocusedInputVisible()`: re-measure after validation messages or other layout changes shift a focused input.

For `FlatList`, `SectionList`, FlashList, or LegendList, pass `KeyboardAwareScrollView` as the list's custom scroll component rather than nesting the list inside it.

## `KeyboardStickyView`

Use when only its child should translate with the keyboard. Configure `offset.closed` and `offset.opened` for safe areas, persistent footers, or intentional spacing. It does not resize siblings or extend the scroll range by itself.

## `KeyboardChatScrollView`

Use for chat-specific content repositioning, scroll-range extension, interactive dismissal, list-end awareness, custom-panel freezing, growing composers, and AI streaming space. Pair it with a separate composer in `KeyboardStickyView`. Use `$build-rnkc-chat-screen` for the full layout and list adapter rules.

## `KeyboardToolbar`

Use for focus navigation and dismissal. The compound API exposes direct `KeyboardToolbar.Background`, `.Content`, `.Prev`, `.Next`, `.Done`, and `.Group` children. Navigation order follows the native view hierarchy; `Group` isolates a subtree's inputs.

## `KeyboardGestureArea`

Use with `keyboardDismissMode="interactive"` on the scroll owner.

- Android 11 and newer: gestures can control keyboard position; choose `interpolator="ios"` or `"linear"`.
- Older Android: renders children without interactive control.
- iOS: use matching `textInputNativeID` and `TextInput.nativeID` when applying `offset` to one or more associated inputs.

## Overlay and visual components

- `OverKeyboardView`: full-screen transparent overlay above the keyboard; mounts children only while `visible`; does not require `KeyboardProvider` when used alone.
- `KeyboardExtender`: attaches non-input content to the keyboard; on iOS it is native keyboard content, while other platforms may use the package fallback. Never nest a `TextInput` inside it.
- `KeyboardBackgroundView`: visually copies the system keyboard surface; it does not handle layout or events.
- `KeyboardEffects`: follows the keyboard and renders content behind it. The `translucent` behavior that removes native blur is iOS-specific.

## Hooks and height conventions

- `useKeyboardAnimation().height` is an `Animated` translation value and is negative while opening.
- `useReanimatedKeyboardAnimation().height` is a negative `SharedValue` while the keyboard is open.
- Compatibility `useAnimatedKeyboard().height` is a positive physical keyboard height and retains Reanimated's `KeyboardState` shape.
- `useKeyboardHandler` events expose positive physical `event.height` and require `"worklet"` in handlers.

Do not copy a unary minus from one API to another without checking the height convention.
