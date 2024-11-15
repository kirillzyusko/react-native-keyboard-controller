import parseDeviceName from "../../utils/parseDeviceName";

type Preference = {
  emojiButtonCoordinates?: { x: number; y: number };
  width: number;
  height: number;
};

const DEVICE_PREFERENCES: Record<string, Preference> = {
  "e2e_emulator_28": {
    emojiButtonCoordinates: undefined,
    width: 1080,
    height: 1920,
  },
  "e2e_emulator_31": {
    emojiButtonCoordinates: { x: 324, y: 1704 },
    width: 1080,
    height: 1920,
  },
  "iPhone 16 Pro": {
    emojiButtonCoordinates: { x: 40, y: 830 },
    width: 393,
    height: 852,
  },
  "iPhone 15 Pro": {
    emojiButtonCoordinates: { x: 40, y: 830 },
    width: 393,
    height: 852,
  },
  "iPhone 14 Pro": {
    emojiButtonCoordinates: { x: 40, y: 830 },
    width: 393,
    height: 852,
  },
  "iPhone 13 Pro": {
    emojiButtonCoordinates: { x: 40, y: 830 },
    width: 390,
    height: 844,
  },
};

export const getDevicePreference = (): Preference => {
  const deviceName = parseDeviceName(device.name);

  if (!deviceName) {
    throw new Error(`Device name is not found`);
  }

  const preference = DEVICE_PREFERENCES[deviceName];

  if (!preference) {
    throw new Error(`Device preference for ${deviceName} is not found`);
  }

  return preference;
};
