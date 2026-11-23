// Shared steps ported from the Detox helpers in kit/helpers, kit/asserts, and
// kit/setup-jest.ts. Plain `.ts`, so the runner does not collect it as a test.
import { execFileSync } from "node:child_process";

import { type Device, test as base } from "@e2e-dev/mobile";
import { type App, type Screen, expect } from "e2e";

export type Ctx = {
  app: App;
  device: Device;
  platform: string;
  screen: Screen;
};

// The engine installs nothing on its own. Install the target's build once per
// device per worker process, the way `detox test` installs `binaryPath`.
const installed = new Set<string>();

export const test = base.extend<{ build: void }>({
  build: async ({ device }, provide) => {
    const id = device.unstable_raw.deviceId;

    if (!installed.has(id)) {
      await device.installApp();
      installed.add(id);
    }
    await provide();
  },
});

// Detox: TIMEOUT_FOR_LONG_OPERATIONS in kit/helpers/actions.
export const LONG_TIMEOUT = 30_000;

const adb = process.env.ANDROID_HOME
  ? `${process.env.ANDROID_HOME}/platform-tools/adb`
  : "adb";

/**
 * agent-device switches an Android emulator to its own headless test IME when
 * it opens an app (its `testIme` option, on by default for emulators, which
 * e2e 0.23 does not expose). That keyboard draws nothing, so every keyboard
 * this suite measures would be missing. Put the system keyboard back.
 */
function restoreSystemKeyboard({ device, platform }: Ctx): void {
  if (platform !== "android") {
    return;
  }
  const serial = device.unstable_raw.deviceId;
  const run = (args: string[]) =>
    execFileSync(adb, ["-s", serial, "shell", ...args], { encoding: "utf8" });
  const systemIme = run(["ime", "list", "-s"])
    .split("\n")
    .map((line) => line.trim())
    .find((id) => id.includes("inputmethod.latin"));

  if (!systemIme) {
    throw new Error(`No system keyboard on ${serial}`);
  }
  run(["ime", "set", systemIme]);
}

/**
 * Launches the example app fresh on its home list, as setup-jest.ts did with
 * `device.launchApp()` before every Detox file.
 */
export async function openHome(ctx: Ctx): Promise<void> {
  const { app, screen } = ctx;

  await app.open();
  restoreSystemKeyboard(ctx);
  await expect(screen.getByTestId("main_scroll_view")).toBeVisible({
    timeout: LONG_TIMEOUT,
  });
}

/**
 * Opens one example from the home list. Ported from
 * `scrollDownUntilElementIsVisible("main_scroll_view", id)` + `waitAndTap(id)`.
 */
export async function openExample(ctx: Ctx, id: string): Promise<void> {
  await openHome(ctx);
  const { screen } = ctx;

  await screen
    .getByTestId("main_scroll_view")
    .scrollUntilVisible(screen.getByTestId(id), { timeout: LONG_TIMEOUT });
  // The list may still be decelerating; a tap then misses the moving row.
  await stableBox(ctx, id);
  await screen.getByTestId(id).tap();
}

/**
 * Ported from `closeKeyboard(textInputId)`: Android presses Back, iOS types a
 * return into the field.
 */
export async function closeKeyboard(
  { device, platform, screen }: Ctx,
  textInputId: string,
): Promise<void> {
  if (platform === "android") {
    await device.back();
  } else {
    await screen.getByTestId(textInputId).press("Enter");
  }
}

/**
 * Ported from `switchToEmojiKeyboard()`. Detox tapped a per-device point on
 * Android (DEVICE_PREFERENCES.emojiButtonCoordinates) and `by.label("Emoji")`
 * on iOS. Both keyboards list the key in the screen tree, so tap it by label:
 * the tap also waits for the keyboard to finish opening.
 */
export async function switchToEmojiKeyboard({
  device,
  platform,
  screen,
}: Ctx): Promise<void> {
  if (platform === "android") {
    // Detox had no emoji key for `e2e_emulator_28` (AOSP keyboard) and
    // skipped the switch there.
    const sdk = execFileSync(
      adb,
      [
        "-s",
        device.unstable_raw.deviceId,
        "shell",
        "getprop",
        "ro.build.version.sdk",
      ],
      { encoding: "utf8" },
    );

    if (Number(sdk.trim()) <= 28) {
      return;
    }
    await screen.getByLabel("Emoji button").tap();
  } else {
    // iOS exposes a hidden duplicate after the active Emoji button.
    await screen.getByLabel("Emoji").first().tap();
  }
}

/**
 * Ported from `.tapBackspaceKey()`, which e2e does not have yet. Android:
 * the DEL key event, as Detox's own implementation sends. iOS: the keyboard's
 * delete key ("Delete" on the numeric pad, "delete" on the letter pad).
 */
export async function tapBackspaceKey(ctx: Ctx): Promise<void> {
  if (ctx.platform === "android") {
    execFileSync(adb, [
      "-s",
      ctx.device.unstable_raw.deviceId,
      "shell",
      "input",
      "keyevent",
      "KEYCODE_DEL",
    ]);

    return;
  }
  await ctx.screen
    .getByLabel(/^delete$/i)
    .first()
    .tap();
}

/**
 * Android only: hides the soft keyboard when one shows, keeping the focus
 * (Back). A view under the keyboard leaves Android's accessibility tree, so
 * e2e cannot read it; Detox read the view hierarchy and could.
 */
export async function hideAndroidKeyboard(ctx: Ctx): Promise<void> {
  if (ctx.platform !== "android") {
    return;
  }
  const holder = ctx.screen.getByTestId(
    "com.google.android.inputmethod.latin:id/keyboard_holder",
  );

  if ((await holder.count()) > 0) {
    await ctx.device.back();
  }
}

/**
 * Ported from `selectText(id)`: iOS double-taps, Android long-presses.
 */
export async function selectText(ctx: Ctx, id: string): Promise<void> {
  if (ctx.platform === "ios") {
    await ctx.screen.getByTestId(id).doubleTap();

    return;
  }
  // agent-device refuses a locator long press on a field it reads as covered
  // (here, half under the keyboard), and e2e has no long press at a point.
  // Hold the part of the field above the keyboard for a second with adb.
  const box = await stableBox(ctx, id);
  const bottom = Math.min(box.y + box.height, await keyboardTop(ctx));
  const x = String(Math.round(box.x + box.width / 2));
  const y = String(Math.round((box.y + bottom) / 2));

  execFileSync(adb, [
    "-s",
    ctx.device.unstable_raw.deviceId,
    "shell",
    "input",
    "swipe",
    x,
    y,
    x,
    y,
    "1000",
  ]);
}

/**
 * Top edge of the soft keyboard in `boundingBox` units, or the screen bottom
 * when none shows. iOS lists a `keyboard` node; Android lists Gboard's
 * keyboard holder (as hidden) beside the app.
 */
async function keyboardTop(ctx: Ctx): Promise<number> {
  const size = await viewport(ctx);

  if (ctx.platform === "ios") {
    const keyboard = ctx.device.locator("role=keyboard");

    if ((await keyboard.count()) === 0) {
      return size.height;
    }
    const box = await keyboard.first().boundingBox();

    return box ? box.y : size.height;
  }
  const holder = ctx.screen.getByTestId(
    "com.google.android.inputmethod.latin:id/keyboard_holder",
  );

  if ((await holder.count()) === 0) {
    return size.height;
  }
  const box = await holder.first().boundingBox();

  return box ? box.y : size.height;
}

/**
 * An element's bounds once it stops moving. Android reports a moving view's
 * frame in flight (a scroll settling, a sheet sliding in), and a point action
 * does not wait for it, so read until two reads agree.
 */
async function stableBox(ctx: Ctx, id: string) {
  const locator = ctx.screen.getByTestId(id);
  let box = await locator.boundingBox();

  for (let i = 0; i < 20; i++) {
    const next = await locator.boundingBox();

    if (box && next && JSON.stringify(box) === JSON.stringify(next)) {
      return box;
    }
    box = next;
  }

  if (!box) {
    throw new Error(`No bounds for ${id}`);
  }

  return box;
}

/**
 * Taps the centre of an element as a point. agent-device refuses a locator tap
 * on a node it reads as covered, which includes views this library draws in
 * or against the keyboard (KeyboardExtender, sticky footers). A finger reaches
 * them, and so does a point tap.
 */
export async function tapAtCentre(ctx: Ctx, id: string): Promise<void> {
  const box = await stableBox(ctx, id);

  await ctx.screen.tapAt({
    x: Math.round(box.x + box.width / 2),
    y: Math.round(box.y + box.height / 2),
  });
}

/**
 * Ported from `expectBitmapsToBeEqual(name, acceptableDiffPercent)`: the whole
 * screen against its stored screenshot. The Detox helper used pixelmatch with
 * `threshold: 0.1` and allowed `acceptableDiffPercent` % of pixels to differ
 * (0.1 by default), retried by `waitForExpect`. e2e retries until `timeout`.
 */
export async function expectScreen(
  screen: Screen,
  name: string,
  acceptableDiffPercent = 0.1,
): Promise<void> {
  await expect(screen).toHaveScreenshot(`${name}.png`, {
    threshold: 0.1,
    maxDiffPixelRatio: acceptableDiffPercent / 100,
    timeout: 15_000,
  });
}

/**
 * Ported from `expectElementBitmapsToBeEqual(id, name, acceptableDiffPercent)`.
 */
export async function expectElement(
  screen: Screen,
  id: string,
  name: string,
  acceptableDiffPercent = 0.1,
): Promise<void> {
  await expect(screen.getByTestId(id)).toHaveScreenshot(`${name}.png`, {
    threshold: 0.1,
    maxDiffPixelRatio: acceptableDiffPercent / 100,
    timeout: 15_000,
  });
}

// ---------------------------------------------------------------------------
// Gestures. Detox's element `swipe`, `scroll`, and `whileElement().scroll()`
// take a finger direction, a distance, and a normalized start point inside the
// element. e2e's locator swipe takes only a content direction, so these build
// the same path from the element's bounding box and use `screen.swipe`.
// ---------------------------------------------------------------------------

type FingerDirection = "up" | "down" | "left" | "right";

const densityCache = new Map<string, number>();

/**
 * Converts Detox distances to the units of `boundingBox` and `screen.swipe`:
 * points on iOS, physical pixels on Android, where Detox counted dp.
 */
function scale({ device, platform }: Ctx): number {
  if (platform !== "android") {
    return 1;
  }
  const serial = device.unstable_raw.deviceId;
  let density = densityCache.get(serial);

  if (density === undefined) {
    const out = execFileSync(adb, ["-s", serial, "shell", "wm", "density"], {
      encoding: "utf8",
    });
    const values = [...out.matchAll(/(\d+)/g)].map((m) => Number(m[1]));

    density = values[values.length - 1]! / 160;
    densityCache.set(serial, density);
  }

  return density;
}

// Espresso's Swipe.FAST and Swipe.SLOW, which Detox's SwipeHelper uses.
const SWIPE_DURATION = { fast: 100, slow: 1500 } as const;
// Detox keeps a swipe's start this far inside the element's edges.
const EDGE_FUZZ = 0.083;
const FINGER_VECTOR: Record<FingerDirection, [-1 | 0 | 1, -1 | 0 | 1]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};
// Normalized start on one axis by the finger's travel on it.
const DEFAULT_START: Record<-1 | 0 | 1, number> = {
  [-1]: 1 - EDGE_FUZZ,
  0: 0.5,
  1: EDGE_FUZZ,
};

const viewportCache = new Map<string, { width: number; height: number }>();

/** The screen in `screen.swipe` units: physical pixels on Android, points on iOS. */
async function viewport(ctx: Ctx): Promise<{ width: number; height: number }> {
  const serial = ctx.device.unstable_raw.deviceId;
  const cached = viewportCache.get(serial);

  if (cached) {
    return cached;
  }
  let size: { width: number; height: number };

  if (ctx.platform === "android") {
    // Detox measures with the app's displayMetrics, which ends above the
    // navigation bar: the bottom of the app's content view.
    const box = await ctx.screen
      .getByTestId("android:id/content")
      .first()
      .boundingBox();

    if (!box) {
      throw new Error("No android:id/content bounds");
    }
    size = { width: box.x + box.width, height: box.y + box.height };
  } else {
    const box = await ctx.device.locator("role=application").boundingBox();

    if (!box) {
      throw new Error("No application bounds");
    }
    size = { width: box.width, height: box.height };
  }
  viewportCache.set(serial, size);

  return size;
}

/**
 * Ported from Detox `element(by.id(id)).swipe(direction, speed, percentage, startX, startY)`,
 * with Detox's own geometry (android/detox/.../SwipeHelper.kt):
 * - the start is normalized inside the element, clamped 8.3% from its edges;
 *   a NaN coordinate defaults to the edge the finger moves away from;
 * - the finger travels `percentage` (default 0.75) of the *screen* in
 *   `direction`, clamped to the screen;
 * - `fast` and `slow` take 100 ms and 1500 ms.
 * Detox names the finger's direction, so this does too.
 */
export async function swipeElement(
  ctx: Ctx,
  id: string,
  direction: FingerDirection,
  speed: "fast" | "slow" = "fast",
  percentage = 0.75,
  startX = NaN,
  startY = NaN,
): Promise<void> {
  const box = await ctx.screen.getByTestId(id).boundingBox();

  if (!box) {
    throw new Error(`No bounds for ${id}`);
  }
  const screenSize = await viewport(ctx);
  const [dx, dy] = FINGER_VECTOR[direction];
  // Default start: the centre of the edge opposite the finger's direction.
  const defaultX = DEFAULT_START[dx];
  const defaultY = DEFAULT_START[dy];
  const clampN = (v: number) => Math.min(Math.max(v, EDGE_FUZZ), 1 - EDGE_FUZZ);
  const nx = clampN(Number.isNaN(startX) ? defaultX : startX);
  const ny = clampN(Number.isNaN(startY) ? defaultY : startY);
  const amount = Math.min(
    Math.max(Number.isNaN(percentage) ? 0.75 : percentage, 0),
    1,
  );
  const from = { x: box.x + box.width * nx, y: box.y + box.height * ny };
  // Espresso clamps the end to the screen edge; agent-device refuses a path
  // that touches it, so stop 1% inside.
  const marginX = screenSize.width * 0.01;
  const marginY = screenSize.height * 0.01;
  const to = {
    x: Math.min(
      Math.max(from.x + dx * amount * screenSize.width, marginX),
      screenSize.width - marginX,
    ),
    y: Math.min(
      Math.max(from.y + dy * amount * screenSize.height, marginY),
      screenSize.height - marginY,
    ),
  };

  await ctx.screen.swipe({
    from: { x: Math.round(from.x), y: Math.round(from.y) },
    to: { x: Math.round(to.x), y: Math.round(to.y) },
    duration: SWIPE_DURATION[speed],
  });
}

/**
 * Ported from Detox `element(by.id(id)).scroll(pixels, direction, startX, startY)`:
 * scrolls the content `direction` by `pixels` (dp on Android), a slow drag
 * so the content stops where the finger lifts.
 */
export async function scrollElement(
  ctx: Ctx,
  id: string,
  pixels: number,
  direction: "up" | "down",
  startX = 0.5,
  startY = 0.5,
): Promise<void> {
  const box = await ctx.screen.getByTestId(id).boundingBox();

  if (!box) {
    throw new Error(`No bounds for ${id}`);
  }
  const distance = pixels * scale(ctx);
  // agent-device refuses a gesture on the screen's edge; Detox's x: 0 meant the edge.
  const x = Math.max(
    box.x + box.width * (Number.isNaN(startX) ? 0.5 : startX),
    box.x + 8,
  );
  const y = box.y + box.height * (Number.isNaN(startY) ? 0.5 : startY);
  // Content scrolls down when the finger moves up.
  const sign = direction === "down" ? -1 : 1;
  const toY = Math.min(
    Math.max(y + sign * distance, box.y + 1),
    box.y + box.height - 1,
  );

  await ctx.screen.swipe({
    from: { x: Math.round(x), y: Math.round(y) },
    to: { x: Math.round(x), y: Math.round(toY) },
    duration: 1000,
  });
}

/**
 * Ported from `scrollDownUntilElementIsVisible(scrollViewId, elementId, { x, y })`.
 */
export async function scrollDownUntilElementIsVisible(
  ctx: Ctx,
  scrollViewId: string,
  elementId: string,
): Promise<void> {
  await expect(ctx.screen.getByTestId(scrollViewId)).toBeVisible({
    timeout: LONG_TIMEOUT,
  });
  // The scroll view shows before its rows do on a screen that is still
  // arriving. `scrollUntilVisible` would scroll for a row it cannot see yet
  // and move one that needed no scroll, so give the row a moment to show.
  const alreadyVisible = await expect(ctx.screen.getByTestId(elementId))
    .toBeVisible({ timeout: 3_000 })
    .then(
      () => true,
      () => false,
    );

  if (alreadyVisible) {
    return;
  }
  await ctx.screen
    .getByTestId(scrollViewId)
    .scrollUntilVisible(ctx.screen.getByTestId(elementId), {
      timeout: LONG_TIMEOUT,
    });
}

/**
 * Ported from `scrollUpUntilElementIsBarelyVisible(scrollViewId, elementId)`:
 * scrolls the content up (the element moves down, toward the keyboard) in
 * small steps until the element stops being reachable, then steps back down
 * once, with Detox's tests: Android, a tap 25 dp below the element's top;
 * iOS, `toBeVisible()` (75% of it showing). Both are measured against the
 * keyboard's top edge, since e2e's `isVisible()` keeps a field visible while
 * any line of it shows.
 */
export async function scrollUpUntilElementIsBarelyVisible(
  ctx: Ctx,
  scrollViewId: string,
  elementId: string,
): Promise<void> {
  const distanceToScroll = ctx.platform === "ios" ? 80 : 50;
  // iOS clips a node's bounds to the part that shows, so take the full height
  // while the element is still in view.
  const fullHeight = (await stableBox(ctx, elementId)).height;

  for (let i = 0; i < 50; i++) {
    await scrollElement(ctx, scrollViewId, distanceToScroll, "up", 0.02, 0.4);
    // A node fully under the keyboard leaves the screen tree.
    let reachable = (await ctx.screen.getByTestId(elementId).count()) > 0;

    if (reachable) {
      const box = await stableBox(ctx, elementId);
      const top = await keyboardTop(ctx);

      if (ctx.platform === "android") {
        // Detox tapped 25 dp below the element's top; that fails once the
        // point is under the keyboard.
        reachable = box.y + 25 * scale(ctx) < top;
      } else {
        // Detox's `toBeVisible()`: at least 75% of the element shows.
        const shown = Math.min(box.y + fullHeight, top) - box.y;

        reachable = shown / fullHeight >= 0.75;
      }
    }
    if (!reachable) {
      await scrollElement(ctx, scrollViewId, 50, "down", 0.01, 0.5);

      return;
    }
  }

  throw new Error(`${elementId} stayed visible after 50 scrolls`);
}

/**
 * Ported from `scrollDownUntilElementIsVisible(scrollViewId, elementId, { x, y })`
 * with a start point: Detox scrolls 200 dp at a time from that point until the
 * element is on screen. Espresso ignores the keyboard (another window), while
 * e2e's `scrollUntilVisible` keeps going until the element clears it, so this
 * stops as soon as the element is inside the scroll view's bounds.
 */
export async function scrollDownUntilElementIsInside(
  ctx: Ctx,
  scrollViewId: string,
  elementId: string,
  startX: number,
  startY: number,
): Promise<void> {
  for (let i = 0; i < 30; i++) {
    const area = await ctx.screen.getByTestId(scrollViewId).boundingBox();
    const box =
      (await ctx.screen.getByTestId(elementId).count()) > 0
        ? await ctx.screen.getByTestId(elementId).boundingBox()
        : null;

    if (
      area &&
      box &&
      box.y >= area.y &&
      box.y + box.height <= area.y + area.height
    ) {
      return;
    }
    await scrollElement(ctx, scrollViewId, 200, "down", startX, startY);
  }

  throw new Error(`${elementId} did not scroll into ${scrollViewId}`);
}

// ---------------------------------------------------------------------------
// Text. Detox `typeText` appends through the keyboard; `replaceText` sets the
// value. e2e: `pressSequentially` and `fill`.
// ---------------------------------------------------------------------------

/**
 * Types into the focused field the way agent-device does with a system
 * keyboard: `adb shell input text`. e2e's `pressSequentially` routes text
 * through agent-device's test IME, which `restoreSystemKeyboard()` switched off;
 * with Gboard active it drops every key after the first.
 */
function androidInputText(ctx: Ctx, text: string): void {
  const escaped = text.replace(/ /g, "%s").replace(/'/g, "'\\''");

  execFileSync(adb, [
    "-s",
    ctx.device.unstable_raw.deviceId,
    "shell",
    `input text '${escaped}'`,
  ]);
}

/** Ported from `typeText(id, text)` / `waitAndType(id, text)`. */
export async function typeText(
  ctx: Ctx,
  id: string,
  text: string,
): Promise<void> {
  const field = ctx.screen.getByTestId(id);

  if (text === "") {
    // Detox typed nothing but focused the field ("just set focus back").
    await field.tap();

    return;
  }

  for (const part of text.split(/(\n)/)) {
    if (part === "") {
      continue;
    }
    if (part === "\n") {
      await field.press("Enter");
    } else if (ctx.platform === "android") {
      await field.focus();
      androidInputText(ctx, part);
    } else {
      await field.pressSequentially(part);
    }
  }
}

/** Ported from `replaceText(id, text)` / `waitAndReplace(id, text)`. */
export async function replaceText(
  ctx: Ctx,
  id: string,
  text: string,
): Promise<void> {
  await ctx.screen.getByTestId(id).fill(text);
}
