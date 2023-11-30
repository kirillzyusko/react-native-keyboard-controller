import waitForExpect from 'wait-for-expect';

import { expectBitmapsToBeEqual } from './asserts';
import { closeKeyboard, waitAndTap, waitForElementById } from './helpers';
import setDemoMode from './utils/setDemoMode';

describe('Example', () => {
  beforeAll(async () => {
    await setDemoMode();
    await device.launchApp();
  });

  it('should navigate to `Animated transition` screen', async () => {
    await waitAndTap('animated_transition');
    await waitForElementById('keyboard_animation_text_input');
  });

  it('should have expected state when keyboard is opened', async () => {
    await waitAndTap('keyboard_animation_text_input');
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual('KeyboardAnimationKeyboardIsShown');
    });
  });

  it('should have expected state when keyboard is closed', async () => {
    await closeKeyboard('keyboard_animation_text_input');
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual('KeyboardAnimationKeyboardIsHidden');
    });
  });
});
