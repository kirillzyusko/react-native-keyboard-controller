# Chat Troubleshooting and Validation

## Diagnose before enabling a workaround

Record React Native, RNKC, Reanimated, platform, OS, architecture, list library, inversion, and navigation configuration. Reproduce with the smallest chat variant that preserves the symptom.

## Android Fabric animation is out of sync

`KeyboardChatScrollView` relies on a Reanimated commit hook. For affected Reanimated versions below 4.3.0, current RNKC documentation calls for the static feature flag:

```json
{
  "reanimated": {
    "staticFeatureFlags": {
      "USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS": true
    }
  }
}
```

Reanimated 4.3.0 and newer enable it by default according to the current guide. Verify the installed version, run pods when required, and rebuild. Do not add the flag when the symptom or version does not match.

## iOS New Architecture animation is missing

A React commit immediately before keyboard presentation can block an animated update. Common triggers include `onFocus` state, `keyboardWillShow` state, toolbar state, or a parent navigator commit.

Use React Profiler to confirm the commit timing. For affected versions, consult the current Reanimated `DISABLE_COMMIT_PAUSING_MECHANISM` guidance. Avoid masking the problem with arbitrary timeouts.

## iOS contentInset area cannot be touched

On affected React Native 0.81 and newer versions, content-inset space may not respond to gestures. RNKC exposes `applyWorkaroundForContentInsetHitTestBug`, which uses Objective-C runtime swizzling.

Enable it only when:

1. the app uses the affected path;
2. the dead hit-test area is reproduced;
3. an upstream React Native patch is not used instead;
4. the app can test conflicts with other native patches.

## `scrollToEnd` stops short while keyboard is open

The virtualized list may calculate its end from an unadjusted visible length. Forward a separate ref to the underlying `KeyboardChatScrollView` and call its `scrollToEnd`. Do not alter global content padding to compensate.

## Inverted content flashes

Increase the virtualized list's offscreen render range such as FlashList `drawDistance`. Verify that `inverted` reaches `KeyboardChatScrollView` and that wrapper identities remain stable.

## Double movement or excess bottom space

Check for duplicate owners:

- `KeyboardAvoidingView` around the chat;
- React state keyboard padding;
- iOS automatic content insets;
- safe-area padding applied by both navigator and screen;
- full composer height passed as `extraContentPadding` while baseline height is also reserved;
- list and RNKC both changing content offset.

Remove one owner; do not tune opposing offsets until the architecture is singular.

## Composer or last message is clipped

Check:

- whether multiline composer growth updates `extraContentPadding`;
- whether the value is a stable `SharedValue`;
- whether the wrapper forwards it to RNKC;
- whether the list also needs content-inset reporting;
- safe-area and bottom-tab offset ownership;
- short-content behavior.

## Validation matrix

### Keyboard lifecycle

- Open, close, change keyboard type, switch emoji keyboard, use Android back.
- Slow interactive drag, fast dismissal, and cancelled drag.
- Open and close while the list is at top, middle, and end.

### Content

- No messages, one short message, short content, and long history.
- Insert local and remote messages while keyboard is open and closed.
- Stream an AI response and complete or cancel it.
- Grow and shrink a multiline composer.

### Lists

- Inverted and non-inverted modes used by the product.
- Initial scroll to latest, maintain-visible-content, jump to latest, scroll to index, and scroll to end.
- Momentum during keyboard transitions.
- Ref stability after parent state changes.

### Layout and navigation

- Safe areas, bottom tabs, custom bottom gaps, and rotation.
- Modal or bottom-sheet presentation.
- Navigate away and back; interactive native-stack pop where applicable.
- Status and navigation bars on Android.

### Keyboard variants and accessibility

- Hardware and floating keyboards where available.
- Predictive or suggestion bar changes.
- Large accessibility text and multiline caret visibility.
- Screen-reader focus and send-button accessibility.

## RNKC repository references

When working in this repository, compare against:

- `docs/docs/guides/building-chat-app.mdx`
- `docs/docs/api/components/keyboard-chat-scroll-view.mdx`
- `example/src/screens/Examples/KeyboardChatScrollView/`
- `example/src/screens/Examples/AILegendListChat/`
- `src/components/KeyboardChatScrollView/`

Use source and tests as the final authority when docs and installed code differ.
