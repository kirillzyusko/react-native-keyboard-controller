let REACore = null;

try {
  REACore = require("react-native-reanimated/src/core");
} catch (e1) {
  try {
    REACore = require("react-native-reanimated/src/reanimated2/core");
  } catch (e2) {
    console.warn("Failed to load REACore from both paths");
  }
}
const registerEventHandler = REACore.registerEventHandler;
const unregisterEventHandler = REACore.unregisterEventHandler;

export { registerEventHandler, unregisterEventHandler };
