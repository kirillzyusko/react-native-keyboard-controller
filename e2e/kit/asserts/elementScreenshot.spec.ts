import fs from "fs";

import { beforeEach, expect, it, jest } from "@jest/globals";
import { device } from "detox";
import { PNG } from "pngjs";

import { isElementScreenshotUsable } from "./elementScreenshot";

import { expectElementBitmapsToBeEqual } from "./index";

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  accessSync: jest.fn(),
}));
jest.mock("detox", () => ({
  device: {
    name: "simulator (iPhone 16e)",
    getPlatform: jest.fn(() => "ios"),
    takeScreenshot: jest.fn(async () => "/screen.png"),
  },
}));
jest.mock("../helpers", () => ({
  Env: { softCheck: false },
  delay: async () => {},
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(fs.writeFileSync).mockReset();
  jest.mocked(device.getPlatform).mockReturnValue("ios");
  Object.assign(globalThis, {
    device,
    by: { id: (id: string) => id },
  });
});

it("keeps native iOS pixels and transparent corners when capture works", async () => {
  const native = new PNG({ width: 10, height: 10 });

  native.data.fill(255);
  native.data.fill(0, 0, 4);

  const takeScreenshot = jest.fn(async () => "/element.png");

  Object.assign(globalThis, {
    element: jest.fn(() => ({ takeScreenshot })),
  });
  const readBitmap = fs.readFileSync as unknown as jest.Mock<
    (path: fs.PathOrFileDescriptor) => Buffer
  >;

  readBitmap.mockReturnValue(PNG.sync.write(native));

  await expectElementBitmapsToBeEqual("keyboard.toolbar", "rounded-toolbar");

  expect(takeScreenshot).toHaveBeenCalledWith("rounded-toolbar");
  expect(device.takeScreenshot).not.toHaveBeenCalled();
  expect(fs.writeFileSync).not.toHaveBeenCalled();
});

it("uses displayed iOS pixels when Fabric returns a translucent placeholder", async () => {
  const placeholder = new PNG({ width: 2, height: 2 });
  const screen = new PNG({ width: 2, height: 2 });

  placeholder.data.fill(79);
  screen.data.fill(255);

  const takeScreenshot = jest.fn(async () => "/element.png");

  Object.assign(globalThis, {
    element: jest.fn(() => ({
      getAttributes: async () => ({
        frame: { x: 0, y: 0, width: 390, height: 390 },
      }),
      takeScreenshot,
    })),
  });
  const readBitmap = fs.readFileSync as unknown as jest.Mock<
    (path: fs.PathOrFileDescriptor) => Buffer
  >;

  readBitmap.mockImplementation((path) =>
    PNG.sync.write(path === "/element.png" ? placeholder : screen),
  );

  await expectElementBitmapsToBeEqual("keyboard.toolbar", "opaque-toolbar");

  expect(takeScreenshot).toHaveBeenCalledWith("opaque-toolbar");
  expect(device.takeScreenshot).toHaveBeenCalledWith("opaque-toolbar");
});

it("rejects uniformly translucent or empty native captures", () => {
  const image = new PNG({ width: 10, height: 10 });

  image.data.fill(79);
  expect(isElementScreenshotUsable(image)).toBe(false);
  image.data.fill(0);
  expect(isElementScreenshotUsable(image)).toBe(false);
});

it("does not hide an opaque native mismatch by trying the screen fallback", async () => {
  const native = new PNG({ width: 2, height: 2 });
  const expected = new PNG({ width: 2, height: 2 });

  native.data.fill(0);
  expected.data.fill(255);

  for (let offset = 3; offset < native.data.length; offset += 4) {
    native.data[offset] = 255;
  }

  Object.assign(globalThis, {
    element: jest.fn(() => ({
      takeScreenshot: async () => "/element.png",
    })),
  });
  const readBitmap = fs.readFileSync as unknown as jest.Mock<
    (path: fs.PathOrFileDescriptor) => Buffer
  >;

  readBitmap.mockImplementation((path) =>
    PNG.sync.write(path === "/element.png" ? native : expected),
  );

  await expect(
    expectElementBitmapsToBeEqual("keyboard.toolbar", "opaque-toolbar"),
  ).rejects.toThrow("pixel diff");
  expect(device.takeScreenshot).not.toHaveBeenCalled();
});

it("keeps Android capture on the displayed screen so Fabric children are included", async () => {
  jest.mocked(device.getPlatform).mockReturnValue("android");

  const screen = new PNG({ width: 2, height: 2 });

  screen.data.fill(255);

  const takeScreenshot = jest.fn();

  Object.assign(globalThis, {
    element: jest.fn(() => ({
      getAttributes: async () => ({
        frame: { x: 0, y: 0, width: 2, height: 2 },
      }),
      takeScreenshot,
    })),
  });
  const readBitmap = fs.readFileSync as unknown as jest.Mock<
    (path: fs.PathOrFileDescriptor) => Buffer
  >;

  readBitmap.mockReturnValue(PNG.sync.write(screen));

  await expectElementBitmapsToBeEqual("keyboard.toolbar", "opaque-toolbar");

  expect(device.takeScreenshot).toHaveBeenCalledWith("opaque-toolbar");
  expect(takeScreenshot).not.toHaveBeenCalled();
});
