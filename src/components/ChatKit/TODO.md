# Findings

1. We can not translate whole `ScrollView` because interactive dismissal will have double scroll if we move it by `translateY` or content will be truncated if we don't do it (same with external container).
2. So we need to move only content inside `ScrollView`.
3. If we use a separate `scrollTo` we still may have a random jump. The only one way is to use `contentOffset` + `padding` on `ScrollView`.
4. Input must be always in `KeyboardStickyView` because it's always pushing above the keyboard (unlike content, which may stay in place).
5. Changing `contentOffset` on `ScrollView` will not work. On iOS it works, but on Android sometimes it doesn't scroll to correct position (when you scroll list to the end) and on paper architecture it is flickering.
6. Next idea is to use `contentInset` on iOS and create custom `ClippingScrollView` on Android (with polyfill `contentInsetBottom` prop).

## To Do

- [x] check how `ClippingScrollView` works in `KeyboardAwareScrollView` on Android (seems to be working well)
- [] `ClippingScrollView` + `KeyboardAwareScrollView` check by e2e tests
- [] create a polyfill-version of ScrollView `that` can add scrollable padding in the bottom of the content? How to wrap custom `ScrollView` with it (cause we may pass one from RNGH)? Should just adjust `contentInset` (scroll management should belong to `KeyboardAwareScrollView`)
- [] make sure, that style property doesn't affect the behavior with/without `ClippingScrollView` (test on a ScrollView that doesn't tke full screen?)
- [] introduce `useCombinedRef` hook in separate PR
- [] introduce `ClippingScrollView` in separate PR + use `ClippingScrollView` in `KeyboardAwareScrollView`
- [] introduce `ChatKit`
