import { ScreenNames } from '../../../constants/screenNames';
import type { Example } from './types';

export const examples: Example[] = [
  {
    title: 'Animated transition',
    info: ScreenNames.ANIMATED_EXAMPLE,
    icons: '😍⌨️',
  },
  { title: 'Chat', info: ScreenNames.REANIMATED_CHAT, icons: '💬' },
  {
    title: 'Chat flatlist',
    info: ScreenNames.REANIMATED_CHAT_FLATLIST,
    icons: '💬',
  },
  { title: 'Events', info: ScreenNames.EVENTS, icons: '🎃 📅' },
  {
    title: 'Aware scroll view',
    info: ScreenNames.AWARE_SCROLL_VIEW,
    icons: '🤓',
  },
  {
    title: 'Aware scroll view sticky footer',
    info: ScreenNames.AWARE_SCROLL_VIEW_STICKY_FOOTER,
    icons: '🤓🩹',
  },
  {
    title: 'Status Bar',
    info: ScreenNames.STATUS_BAR,
    icons: '🔋',
  },
  {
    title: 'Lottie',
    info: ScreenNames.LOTTIE,
    icons: '⚠️ 🎞',
  },
  {
    title: 'Non UI Props',
    info: ScreenNames.NON_UI_PROPS,
    icons: '🚀',
  },
  {
    title: 'Interactive keyboard 🤖',
    info: ScreenNames.INTERACTIVE_KEYBOARD,
    icons: '👆📱',
  },
  {
    title: 'Interactive keyboard 🍏',
    info: ScreenNames.INTERACTIVE_KEYBOARD_IOS,
    icons: '👆📱',
  },
  {
    title: 'Native stack',
    info: ScreenNames.NATIVE_STACK,
    icons: '⚛️',
  },
  {
    title: 'KeyboardAvoidingView',
    info: ScreenNames.KEYBOARD_AVOIDING_VIEW,
    icons: '😶',
  },
  {
    title: 'Enabled/disabled',
    info: ScreenNames.ENABLED_DISABLED,
    icons: '💡',
  },
];
