# Findings

1. We can not translate whole `ScrollView` because interactive dismissal will have double scroll if we move it by `translateY` or content will be truncated if we don't do it (same with external container).
2. So we need to move only content inside `ScrollView`.
3. If we use a separate `scrollTo` we still may have a random jump. The only one way is to use `contentOffset` + `padding` on `ScrollView`.
4. Input must be always in `KeyboardStickyView` because it's always pushing above the keyboard (unlike content, which may stay in place).
5. Changing `contentOffset` on `ScrollView` will not work. On iOS it works, but on Android sometimes it doesn't scroll to correct position (when you scroll list to the end) and on paper architecture it is flickering.
6. Next idea is to use `contentInset` on iOS and create custom `ClippingScrollView` on Android (with polyfill `contentInsetBottom` prop).

## To Do

- [x] check how `ClippingScrollView` works in `KeyboardAwareScrollView` on Android (seems to be working well)
- [x] introduce `useCombinedRef` hook in separate PR
- [x] make sure, that style property doesn't affect the behavior with/without `ClippingScrollView` (test on a ScrollView that doesn't tke full screen?) <-- tested by comparing iOS with Android + `ClippingScrollView` (`contentInsetBottom` never override `paddingBottom` from `style`/`contentContainerStyle` even if ScrollView has `maxHeight=150` and we have only 2 inputs limitation + also tested `ScrollView` without height restrictions, in this case `paddingBottom` on `style` is not getting applied (it doesn't have an effect on both iOS/Android), but `contentContainerStyle` + `paddingBottom` works as expected and if I add `contentInsetBottom` to `ClippingScrollView` it doesn't overwrite a padding and increases scrollable area)
- [x] `ClippingScrollView` + `KeyboardAwareScrollView` check by e2e tests (seems to be working, though on Android emulator + e2e tests sometimes when keyboard disappear we still have keyboard space)
- [x] introduce `ClippingScrollView` in separate PR
- [x] create a polyfill-version of ScrollView `that` can add scrollable padding in the bottom of the content? How to wrap custom `ScrollView` with it (cause we may pass one from RNGH)? Should just adjust `contentInset` (scroll management should belong to `KeyboardAwareScrollView`) (ScrollViewWithKeyboardPadding/ScrollViewWithKeyboardSpace)
- [-] use `ClippingScrollView` in `KeyboardAwareScrollView` in separate PR
- [-] introduce `ChatKit`
- [] create issue in reanimated repo about `scrollTo` performance regression
