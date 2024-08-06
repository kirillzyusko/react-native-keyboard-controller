let REACore = null;

try {
  REACore = require("react-native-reanimated/src/core");
} catch (e) {
  console.log(e);
  REACore = require("react-native-reanimated/src/reanimated2/core");
}
const registerEventHandler = REACore.registerEventHandler;
const unregisterEventHandler = REACore.unregisterEventHandler;

export { registerEventHandler, unregisterEventHandler };
