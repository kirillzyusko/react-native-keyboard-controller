import { TurboModuleRegistry } from "react-native";

import type { TurboModule } from "react-native";

export interface Spec extends TurboModule {
  readonly getConstants: () => {};

  setHidden(hidden: boolean): void;
  setColor(color: number, animated: boolean): void;
  setTranslucent(translucent: boolean): void;
  setStyle(style: string): void;
}

export default TurboModuleRegistry.get<Spec>("StatusBarManagerCompat");
