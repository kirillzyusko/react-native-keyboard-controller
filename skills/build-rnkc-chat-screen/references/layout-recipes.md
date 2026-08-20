# Chat Layout Recipes

## Base chat

Use `KeyboardChatScrollView` for messages and keep the composer as a sibling in `KeyboardStickyView`:

```tsx
function ChatScreen() {
  return (
    <View style={{ flex: 1 }}>
      <KeyboardChatScrollView>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </KeyboardChatScrollView>
      <KeyboardStickyView>
        <Composer />
      </KeyboardStickyView>
    </View>
  );
}
```

This establishes separate ownership: message repositioning belongs to the scroll view; composer translation belongs to the sticky view.

## Interactive dismissal

Wrap both message scroll and composer with `KeyboardGestureArea`. Set the scroll owner to interactive dismissal:

```tsx
const INPUT_NATIVE_ID = "chat-composer";

<KeyboardGestureArea
  interpolator="ios"
  style={{ flex: 1 }}
  textInputNativeID={INPUT_NATIVE_ID}
>
  <KeyboardChatScrollView keyboardDismissMode="interactive">
    <Messages />
  </KeyboardChatScrollView>
  <KeyboardStickyView>
    <TextInput nativeID={INPUT_NATIVE_ID} />
  </KeyboardStickyView>
</KeyboardGestureArea>;
```

- Android 11 and newer can use the gesture area to control keyboard movement.
- Older Android renders the children without interactive keyboard control.
- On iOS, matching `textInputNativeID` and `nativeID` associates offset behavior with the focused input.

Set `KeyboardGestureArea.offset` only when the keyboard interaction should account for an additional composer or accessory height. It is a different concern from `KeyboardChatScrollView.offset`.

## Safe areas, bottom tabs, and fixed bottom elements

`KeyboardChatScrollView.offset` is the distance between its bottom edge and the physical screen bottom. The effective keyboard lift is `keyboardHeight - offset`.

Build the value from actual fixed elements:

```tsx
const offset = safeAreaBottom + visibleBottomTabHeight + fixedGap;

<KeyboardChatScrollView offset={offset} />;
```

Do not add an inset already consumed by a `SafeAreaView` or navigator. Inspect the measured layout and use one owner for each inset.

Configure `KeyboardStickyView.offset.opened` separately so the composer lands at the intended visible position:

```tsx
<KeyboardStickyView
  offset={{
    closed: 0,
    opened: safeAreaBottom,
  }}
>
  <Composer />
</KeyboardStickyView>
```

The exact sign and value depend on whether the screen, navigator, or safe-area container already reserves the inset. Validate visually rather than copying a constant.

## Lift behaviors

### `always`

Use for messenger semantics where the viewport should follow the keyboard even while the user is reading away from the end. This is the default.

### `whenAtEnd`

Use when opening the composer should not disturb a user reading older content. The list lifts only when RNKC considers the content end visible.

### `persistent`

Use when closing the keyboard should not undo the lifted position. Verify subsequent scrolls and message insertion because this intentionally retains position.

### `never`

Use when the keyboard may overlap the list and content should not move. Ensure the product still provides a way to reach obscured content.

## Short and long content

Test both. Short content reveals inset, blank-space, and alignment bugs; long content reveals momentum and end-detection problems. Also test when the user is at the top, middle, and end before opening and closing the keyboard.

## Do not use general avoidance around chat

`KeyboardAvoidingView` and `KeyboardAwareScrollView` solve bounded layouts and focused-input forms. Around chat they can create duplicate scroll movement, layout reflow, first-message placement problems, and interactive-dismiss conflicts. Keep them outside the chat ownership graph unless they serve an independent nested region with a clearly separate responsibility.
