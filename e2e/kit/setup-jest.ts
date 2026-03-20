import setDemoMode from "./utils/setDemoMode";

beforeAll(async () => {
  await setDemoMode();
  await device.launchApp();
});

afterAll(async () => {
  await device.terminateApp();
});
