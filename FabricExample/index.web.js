import { AppRegistry } from "react-native";

import name from "./app.json";
import App from "./src/App";

AppRegistry.registerComponent(name, () => App);
AppRegistry.runApplication(name, {
  initialProps: {},
  rootTag: document.getElementById("app-root"),
});
