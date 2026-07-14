# Migrate react-native-keyboard-aware-scroll-view

Use this reference for APSL `react-native-keyboard-aware-scroll-view`, including `KeyboardAwareScrollView`, `KeyboardAwareFlatList`, `KeyboardAwareSectionList`, `listenToKeyboardEvents`, and wrapper components.

Upstream source: https://github.com/APSL/react-native-keyboard-aware-scroll-view

RNKC API: https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view

## Choose the target scroll owner

- Replace an APSL `KeyboardAwareScrollView` with RNKC `KeyboardAwareScrollView` when it owns a normal scrollable form.
- Keep `FlatList`, `SectionList`, FlashList, or LegendList as the virtualized owner and inject RNKC `KeyboardAwareScrollView` through the list's custom scroll-component API.
- Do not nest a virtualized list inside RNKC `KeyboardAwareScrollView` to imitate APSL's exported list wrappers.
- Use `KeyboardChatScrollView`, not `KeyboardAwareScrollView`, for chat message behavior.

## Prop mapping

| APSL API                                    | RNKC target                                                | Confidence and notes                                                                         |
| ------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `extraHeight`                               | `bottomOffset`                                             | Documented RNKC equivalent: space between caret and keyboard                                 |
| `extraScrollHeight`                         | `extraKeyboardSpace`                                       | Documented RNKC equivalent: extra bottom keyboard space                                      |
| `enableOnAndroid`                           | Remove                                                     | RNKC is cross-platform; verify Android setup                                                 |
| `enableAutomaticScroll`                     | Usually `enabled`                                          | Not perfectly granular; `enabled={false}` disables RNKC behavior, so inspect mixed-use cases |
| `enableResetScrollToCoords={false}`         | `disableScrollOnKeyboardHide`                              | Closest intent: preserve position on hide                                                    |
| `resetScrollToCoords`                       | Explicit `ref.current?.scrollTo(...)` on the desired event | No direct prop; decide whether reset is still needed                                         |
| `viewIsInsideTabBar`                        | Explicit layout or offset calculation                      | No fixed tab-bar magic constant; measure the real layout                                     |
| `keyboardOpeningTime`                       | Remove                                                     | RNKC follows native keyboard timing; do not preserve delay timers by default                 |
| `innerRef`                                  | Standard React `ref`                                       | Update wrapper types and ref forwarding                                                      |
| `onKeyboardWillShow` and related callbacks  | `KeyboardEvents` or animation hooks                        | Choose by business-event versus UI-animation intent                                          |
| `enableOnAndroid` plus manifest `adjustPan` | RNKC plus `adjustResize` ownership                         | See the Android soft-input reference                                                         |

## Basic scroll-view migration

```diff
-import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
+import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

 <KeyboardAwareScrollView
-  enableOnAndroid
-  extraHeight={24}
-  extraScrollHeight={12}
-  enableResetScrollToCoords={false}
+  bottomOffset={24}
+  extraKeyboardSpace={12}
+  disableScrollOnKeyboardHide
 >
   <Form />
 </KeyboardAwareScrollView>
```

Do not sum `extraHeight` and `extraScrollHeight` into one prop; they represent different concerns.

## Choose `mode`

RNKC defaults to `mode="insets"`, which extends scroll range without reflowing child layout. Prefer it for most forms.

Use `mode="layout"` when keyboard space must participate in layout, especially when old content depends on:

- `contentContainerStyle={{ flex: 1 }}`;
- `justifyContent: "space-between"`;
- a submit button distributed to the bottom;
- `gap` or other flex layout that should rearrange as space changes.

Verify the old screen rather than inferring mode from one style in isolation.

## Migrate imperative methods

| APSL method                        | RNKC replacement                                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `scrollToPosition(x, y, animated)` | Native ScrollView `ref.current?.scrollTo({ x, y, animated })`                                              |
| `scrollToEnd(animated)`            | Native ScrollView `ref.current?.scrollToEnd({ animated })`                                                 |
| `scrollToFocusedInput(...)`        | `ref.current?.assureFocusedInputVisible()` when the currently focused input moved                          |
| `scrollIntoView(...)`              | Keep explicit application measurement/scrolling, or use focused-input assurance if that is the real intent |
| `getScrollResponder()`             | Inspect consumer; use the forwarded native scroll ref where possible                                       |

Example after validation errors change layout:

```tsx
const scrollRef = useRef<KeyboardAwareScrollViewRef>(null);

useEffect(() => {
  scrollRef.current?.assureFocusedInputVisible();
}, [errors]);

<KeyboardAwareScrollView ref={scrollRef} bottomOffset={24}>
  <Form />
</KeyboardAwareScrollView>;
```

## Migrate virtualized list wrappers

APSL exports keyboard-aware list components. RNKC instead decorates the list's scroll component:

```tsx
const AwareScrollView = forwardRef<ScrollView, ScrollViewProps>(
  (props, ref) => <KeyboardAwareScrollView ref={ref} {...props} />,
);

const renderScrollComponent = useCallback(
  (props: ScrollViewProps) => <AwareScrollView {...props} />,
  [],
);

<FlatList
  data={items}
  renderItem={renderItem}
  renderScrollComponent={renderScrollComponent}
/>;
```

Use the list library's exact ref and custom-scroll contract. FlashList can commonly receive a stable component reference; FlatList and LegendList commonly use a stable callback. Preserve list-specific props, ref ownership, inversion, and scroll-to-index behavior.

## Migrate the HOC

For `listenToKeyboardEvents(config)(CustomScrollComponent)`:

1. Identify what the HOC actually adds: focused-input scrolling, event callbacks, Android enablement, offsets, or ref extraction.
2. Wrap RNKC `KeyboardAwareScrollView` around the custom `ScrollViewComponent`, or inject it via the parent list's `renderScrollComponent`.
3. Move only still-relevant config to RNKC props.
4. Replace `refPropName` and `extractNativeRef` with explicit `forwardRef` and the target component's current ref contract.

Do not recreate a generic HOC unless multiple active consumers still need the same abstraction.

## Migrate event callbacks separately

APSL can expose keyboard callbacks as component props. RNKC separates concerns:

- Business side effects at will/did boundaries: `KeyboardEvents`.
- React rendering: `useKeyboardState` with a selector.
- Animated UI or frame tracking: animation hooks or `useKeyboardHandler`.

RNKC does not expose `keyboardWillChangeFrame` and `keyboardDidChangeFrame` through `KeyboardEvents`. Use animation values or lifecycle handlers when the old code needs movement rather than only show/hide boundaries.

## Android configuration

APSL's documented Android enhancement path uses `adjustPan` plus `enableOnAndroid`. RNKC's animation path expects `adjustResize` with its edge-to-edge controller. Change ownership intentionally and test Android before removing old manifest or Expo settings.

## Validate

- Focus every input with normal and large accessibility text.
- Verify the caret, not only the input bounds, stays visible for multiline inputs.
- Show and hide validation messages, then call `assureFocusedInputVisible` where needed.
- Verify hide behavior with and without scroll-position preservation.
- Test short content, long content, nested navigation, bottom tabs, and bottom sheets.
- Test each migrated list's virtualization, refs, scroll-to-index, inversion, and content-inset behavior.
- Search for remaining APSL imports, HOCs, types, manifest `adjustPan`, and patches before uninstalling.
