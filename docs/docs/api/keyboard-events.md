# KeyboardEvents

This library exposes 4 events which are available on all platforms:

- keyboardWillShow
- keyboardWillHide
- keyboardDidShow
- keyboardDidHide

Example how to use them:

```ts
import { KeyboardEvents } from 'react-native-keyboard-controller';

useEffect(() => {
  const show = KeyboardEvents.addListener('keyboardWillShow', (e) => {
    // place your code here
  });

  return () => {
    show.remove();
  };
}, []);
```