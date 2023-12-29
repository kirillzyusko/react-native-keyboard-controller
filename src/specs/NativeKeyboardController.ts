import { TurboModuleRegistry } from "react-native";

import type { TurboModule } from "react-native";

type Direction = "next" | "prev";

export interface Spec extends TurboModule {
  readonly getConstants: () => {};

  // methods
  setInputMode(mode: number): void;
  setDefaultMode(): void;
  dismiss(): void;
  moveFocusTo(direction: Direction): void;

  // event emitter
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.get<Spec>("KeyboardController");
