# Findings

1. We can not translate whole `ScrollView` because interactive dismissal will have double scroll if we move it by `translateY` or content will be truncated if we don't do it (same with external container).
2. So we need to move only content inside `ScrollView`.
3. If we use a separate `scrollTo` we still may have a random jump. The only one way is to use `contentOffset` + `padding` on `ScrollView`.
4. Input must be always in `KeyboardStickyView` because it's always pushing above the keyboard (unlike content, which may stay in place).
5. Changing `contentOffset` on `ScrollView` will not work. On iOS it works, but on Android sometimes it doesn't scroll to correct position (when you scroll list to the end) and on paper architecture it is flickering.
