import waitForExpect from 'wait-for-expect';

import { expectBitmapsToBeEqual } from './asserts';
import { tap, waitAndReplace, waitAndTap, waitAndType } from './helpers';
import setDemoMode from './utils/setDemoMode';

const BLINKING_CURSOR = 0.35;

describe('AwareScrollView test cases', () => {
  beforeAll(async () => {
    await setDemoMode();
    await device.launchApp();
  });

  it('should push input above keyboard on focus', async () => {
    await waitAndTap('aware_scroll_view');
    await waitAndTap('TextInput#3');
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        'AwareScrollViewFirstInputFocused',
        BLINKING_CURSOR
      );
    });
  });

  it('should detect TextInput growth', async () => {
    await waitAndType('TextInput#3', '\n\n\n\n');
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        'AwareScrollViewFirstInputGrown',
        BLINKING_CURSOR
      );
    });
  });

  it('should auto-scroll when new input gets focused', async () => {
    // scroll while keeping a focus is not working: https://github.com/wix/Detox/issues/174
    // but we may use `await element(by.id('TextInput#3')).swipe('up');` (currently focused input as event receiver)
    await waitAndReplace('TextInput#3', '\n\n');
    await waitAndTap('TextInput#4');
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        'AwareScrollViewInputChanged',
        BLINKING_CURSOR
      );
    });
  });

  it('should scroll back when keyboard dismissed', async () => {
    // tap outside to close a keyboard
    await tap('aware_scroll_view_container', { x: 0, y: 100 });
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        'AwareScrollViewKeyboardClosed',
        BLINKING_CURSOR
      );
    });
  });
});
