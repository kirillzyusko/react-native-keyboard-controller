# Virtualized Chat Lists

## Preserve virtualization ownership

Keep `FlatList`, `SectionList`, FlashList, LegendList, or the application's list as the message owner. Inject `KeyboardChatScrollView` as its underlying scroll component. Do not render the virtualized list inside a separate chat scroll view.

## Create a typed wrapper

```tsx
import { forwardRef } from "react";
import type { ScrollViewProps } from "react-native";
import {
  KeyboardChatScrollView,
  type KeyboardChatScrollViewProps,
} from "react-native-keyboard-controller";

type ChatScrollRef = React.ElementRef<typeof KeyboardChatScrollView>;

export const ChatScrollView = forwardRef<
  ChatScrollRef,
  ScrollViewProps & KeyboardChatScrollViewProps
>((props, ref) => {
  return (
    <KeyboardChatScrollView
      ref={ref}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      keyboardDismissMode="interactive"
      {...props}
    />
  );
});
```

Disable iOS automatic content inset adjustment so the list and RNKC do not both modify insets. Place application defaults before `{...props}` when the list must be allowed to override them; place invariants after the spread when the wrapper must enforce them. Make that choice explicit.

## FlashList

FlashList accepts a stable component reference:

```tsx
<FlashList
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  renderScrollComponent={ChatScrollView}
/>
```

When inverted content flashes during keyboard animation, increase the list's offscreen render distance such as `drawDistance` before adding unrelated keyboard workarounds.

## FlatList and LegendList

Use a stable callback:

```tsx
const renderScrollComponent = useCallback(
  (props: ScrollViewProps) => <ChatScrollView {...props} />,
  [],
);

<FlatList
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  renderScrollComponent={renderScrollComponent}
/>;
```

When the wrapper receives shared values or changing configuration, include those stable references in the callback dependency list:

```tsx
const renderScrollComponent = useCallback(
  (props: ScrollViewProps) => (
    <ChatScrollView
      {...props}
      extraContentPadding={composerExtraPadding}
      keyboardLiftBehavior={keyboardLiftBehavior}
    />
  ),
  [composerExtraPadding, keyboardLiftBehavior],
);
```

Avoid inline `renderScrollComponent={(props) => ...}` in the list JSX when it recreates the scroll component and can disturb ref or scroll state.

## Propagate inversion

If the list is inverted, pass the same value to `KeyboardChatScrollView`:

```tsx
const ChatScrollView = forwardRef<ChatScrollRef, ChatScrollProps>(
  ({ inverted, ...props }, ref) => (
    <KeyboardChatScrollView ref={ref} inverted={inverted} {...props} />
  ),
);
```

For non-inverted lists, the content end is the bottom. For inverted lists, RNKC treats the top of the scroll view as the logical end where latest messages appear. `onEndVisible` and `keyboardLiftBehavior="whenAtEnd"` follow this interpretation.

Do not reverse the message array and set `inverted` without understanding the list library's ordering contract. Preserve the application's existing data semantics during keyboard migration.

## Forward the underlying chat scroll ref

Some virtualized lists own the scroll-component ref internally. When `FlatList.scrollToEnd()` ignores keyboard-adjusted layout, keep an additional ref to the underlying `KeyboardChatScrollView`:

```tsx
type Props = ScrollViewProps & {
  chatScrollViewRef: React.MutableRefObject<ChatScrollRef | null>;
};

const ChatScrollView = forwardRef<ChatScrollRef, Props>(
  ({ chatScrollViewRef, ...props }, listRef) => {
    const setRef = useCallback(
      (instance: ChatScrollRef | null) => {
        if (typeof listRef === "function") {
          listRef(instance);
        } else if (listRef) {
          listRef.current = instance;
        }

        chatScrollViewRef.current = instance;
      },
      [chatScrollViewRef, listRef],
    );

    return <KeyboardChatScrollView ref={setRef} {...props} />;
  },
);
```

Then call:

```tsx
chatScrollViewRef.current?.scrollToEnd();
```

Use this workaround only when the list's own method demonstrably stops short while the keyboard is open.

## Composer height and list contracts

Pass `extraContentPadding` through the wrapper so RNKC can extend the underlying scroll range. Some lists also require their own content-inset reporting to calculate initial position or scroll targets. For example, a LegendList adapter may need to report the composer height separately while also passing the shared value to RNKC.

Do not assume RNKC's synthetic Android inset appears in the native list's `onScroll` payload. Use `onContentInsetChange` when the list performs its own end-target calculation from offsets and content length.

## AI anchor adapters

For AI streaming, the list adapter may need item measurement or an `anchorToTopIndex` concept to calculate the content below the last user message. Keep that calculation in the list-specific adapter and pass the resulting shared value as `blankSpace`. RNKC owns how the minimum inset interacts with keyboard and composer padding; the list owns item measurement.

## Validate each list integration

- Initial position at the latest message.
- Insert messages while closed and open.
- Scroll to top, middle, and end.
- Open and close at each position.
- Interactive dismissal during momentum.
- Inverted and non-inverted modes used by the product.
- `scrollToEnd`, `scrollToIndex`, maintain-visible-content behavior, and jump-to-latest.
- Short content and thousands of items.
- Composer height changes and safe-area rotation.
- Ref stability across parent renders.
