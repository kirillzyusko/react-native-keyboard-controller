---
sidebar_position: 3
---

# Interactive Keyboard Dismissing

// TODO: step by step guide? As in GH?

1. Wrap Scrollable element (ScrollView, FlatList, etc) in `<InteractiveKeyboard>` element;
2. Use `useInteractiveKeyboardAnimation` and pass `handler` to `<InteractiveKeyboard>`
3. Use `const { height } = useReanimatedKeyboardAnimation();` as before :D