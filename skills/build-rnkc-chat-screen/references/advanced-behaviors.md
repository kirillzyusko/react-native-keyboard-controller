# Advanced Chat Behaviors

## Growing multiline composer

`KeyboardStickyView` moves the composer, but the message scroll view cannot infer how much the composer grows. Pass a Reanimated shared value through `extraContentPadding`.

Use a delta above the composer's baseline height when the list already reserves the baseline separately:

```tsx
const BASE_COMPOSER_HEIGHT = 42;
const extraContentPadding = useSharedValue(0);

const onComposerLayout = useCallback(
  (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;

    extraContentPadding.value = withTiming(
      Math.max(height - BASE_COMPOSER_HEIGHT, 0),
      { duration: 250 },
    );
  },
  [extraContentPadding],
);

<KeyboardChatScrollView extraContentPadding={extraContentPadding} />;
<KeyboardStickyView>
  <TextInput multiline onLayout={onComposerLayout} />
</KeyboardStickyView>;
```

If the list reserves no separate baseline, pass the full external composer height. State which convention the layout uses; mixing a full height with separately reserved baseline padding causes double space.

## Emoji picker, attachment sheet, or custom input panel

Use `freeze` to pause keyboard-driven padding, content offset, and scroll changes while switching away from the keyboard:

```tsx
const freeze = useSharedValue(false);

const openEmojiPicker = async () => {
  freeze.value = true;
  await KeyboardController.dismiss({ keepFocus: true });
  showEmojiPicker.value = true;
};

const returnToKeyboard = () => {
  showEmojiPicker.value = false;
  freeze.value = false;
  inputRef.current?.focus();
};

<KeyboardChatScrollView freeze={freeze} />;
```

The exact order depends on whether the custom panel occupies keyboard space, whether focus should remain, and how it animates. Freeze before the keyboard starts changing the layout. Unfreeze only when the next owner is ready.

Use a shared value when the transition originates on the UI thread or must be synchronous. A boolean is adequate for ordinary React-driven transitions.

## AI response streaming and `blankSpace`

`blankSpace` is a minimum inset floor:

```text
effective bottom padding = max(blankSpace, keyboard padding + extraContentPadding)
```

Use it to leave room below a newly sent user message while an AI response streams. Calculate the required space from the list's real measurements:

```tsx
blankSpace.value = Math.max(0, viewportHeight - contentHeightBelowAnchor);
```

As the response grows, decrease the blank space. Reset it when the content naturally fills the desired viewport or the anchoring interaction ends.

The current RNKC implementation clamps blank space to one scroll-view viewport. One viewport is enough to move short content without allowing a fully blank screen beyond that range. Do not design an adapter that requires arbitrary multi-viewport blank space without verifying the installed implementation.

On iOS with affected React Native versions, content-inset space may not receive touch or scroll input. Reproduce the issue before enabling `applyWorkaroundForContentInsetHitTestBug` because the workaround uses runtime swizzling.

## Jump to latest

Use `onEndVisible` to show or hide a jump button:

```tsx
const [showJump, setShowJump] = useState(false);

<KeyboardChatScrollView onEndVisible={(visible) => setShowJump(!visible)} />;
```

For UI-thread animation, pass a worklet and update a shared value rather than routing every end-state transition through React state.

Remember that logical end is bottom for non-inverted content and top for inverted content.

## Effective inset reporting

Use `onContentInsetChange` when a virtualized list maintains its own scroll target and needs RNKC's dynamic inset. The callback can fire on animation frames. Avoid React state if the value only drives UI-thread calculation.

This is especially relevant on Android because RNKC simulates content inset and the native `onScroll` payload does not report it as an iOS `contentInset`.

## Solid or animated keyboard background

Use `KeyboardEffects` behind the chat to change what is visible through the iOS keyboard:

```tsx
<KeyboardEffects>
  <View style={{ flex: 1, backgroundColor: chatBackground }} />
</KeyboardEffects>
```

An opaque view creates a solid app-matching background. A gradient, Skia canvas, or animation can create richer effects. The keyboard translucency behavior is iOS-specific; Android's keyboard is opaque.

Use `KeyboardBackgroundView` instead when app UI should visually match the system keyboard surface rather than replace what appears behind the keyboard.

## Interactive gesture offset

`KeyboardGestureArea.offset` and `KeyboardChatScrollView.offset` solve different problems:

- Gesture-area offset associates keyboard gesture behavior with the composer or accessory height and matching input IDs.
- Chat-scroll offset describes the fixed distance between the scroll view and physical screen bottom.

Do not copy the same number into both without tracing the layout.
