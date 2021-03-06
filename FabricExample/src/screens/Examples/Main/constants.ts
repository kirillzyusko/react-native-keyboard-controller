import { ScreenNames } from '../../../constants/screenNames';
import type { Example } from './types';

export const examples: Example[] = [
  {
    title: 'Animated transition',
    info: ScreenNames.ANIMATED_EXAMPLE,
    icons: '😍⌨️',
  },
  { title: 'Chat', info: ScreenNames.REANIMATED_CHAT, icons: '💬' },
  { title: 'Events', info: ScreenNames.EVENTS, icons: '🎃 📅' },
  {
    title: 'Aware scroll view (WIP)',
    info: ScreenNames.AWARE_SCROLL_VIEW,
    icons: '🤓',
  },
  {
    title: 'Status Bar',
    info: ScreenNames.STATUS_BAR,
    icons: '🔋',
  },
];
