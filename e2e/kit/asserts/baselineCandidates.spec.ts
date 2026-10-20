import fs from "fs";

import { beforeEach, expect, it, jest } from "@jest/globals";
import { PNG } from "pngjs";

import { expectBitmapsToBeEqual } from "./index";

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  accessSync: jest.fn(),
}));
jest.mock("detox", () => ({
  device: {
    name: "emulator (e2e_emulator_28)",
    getPlatform: () => "android",
    takeScreenshot: async () => "/capture.png",
  },
}));
jest.mock("../helpers", () => ({
  Env: { softCheck: false },
  delay: async () => {},
}));

const bitmap = (value: number) => {
  const image = new PNG({ width: 2, height: 2 });

  image.data.fill(value);

  for (let pixel = 0; pixel < 4; pixel += 1) {
    image.data[pixel * 4 + 3] = 255;
  }

  return PNG.sync.write(image);
};
const captured = bitmap(255);
const readBitmap = fs.readFileSync as unknown as jest.Mock<
  (path: fs.PathOrFileDescriptor) => Buffer
>;

beforeEach(() => {
  jest.clearAllMocks();
});

it("accepts either reviewed baseline without writing new reference images", async () => {
  readBitmap.mockImplementation((path) =>
    path.toString().endsWith("legacy.png") ? bitmap(0) : captured,
  );

  await expectBitmapsToBeEqual(["legacy", "restored"]);

  expect(fs.readFileSync).toHaveBeenCalledWith(
    "kit/assets/android/e2e_emulator_28/legacy.png",
  );
  expect(fs.readFileSync).toHaveBeenCalledWith(
    "kit/assets/android/e2e_emulator_28/restored.png",
  );
  expect(fs.writeFileSync).not.toHaveBeenCalled();
});

it("fails if any declared reference is missing, even when another matches", async () => {
  readBitmap.mockImplementation((path) => {
    if (path.toString().endsWith("missing.png")) {
      throw new Error("ENOENT: missing reference");
    }

    return captured;
  });

  await expect(expectBitmapsToBeEqual(["restored", "missing"])).rejects.toThrow(
    "ENOENT",
  );
  expect(fs.writeFileSync).not.toHaveBeenCalled();
});

it("rejects a capture that matches none of the reviewed references", async () => {
  readBitmap.mockImplementation((path) =>
    path === "/capture.png" ? captured : bitmap(0),
  );

  await expect(expectBitmapsToBeEqual(["legacy", "restored"])).rejects.toThrow(
    "pixel diff",
  );
});
