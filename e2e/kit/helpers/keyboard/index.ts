import { execFileSync } from "child_process";

export const getKeyboardTop = (): number | undefined => {
  if (device.getPlatform() !== "android") {
    return undefined;
  }

  const keyboardTop = execFileSync(
    "adb",
    // cspell:ignore dumpsys
    ["-s", device.id, "shell", "dumpsys", "window", "displays"],
    { encoding: "utf8" },
  ).match(
    /InsetsSource[^\n]*\btype=ime frame=\[\d+,(\d+)\][^\n]*\bvisible=true/,
  )?.[1];

  return keyboardTop === undefined ? undefined : Number(keyboardTop);
};

export const expectElementAboveKeyboard = async (
  elementId: string,
  keyboardTop: number | undefined,
): Promise<void> => {
  if (keyboardTop === undefined) {
    return;
  }

  // Edge-to-edge content can remain visible behind the keyboard.
  const { frame } = (await element(
    by.id(elementId),
  ).getAttributes()) as Detox.AndroidElementAttributes;

  if (frame.y + frame.height * 0.75 > keyboardTop) {
    throw new Error("The input is covered by the keyboard");
  }
};
