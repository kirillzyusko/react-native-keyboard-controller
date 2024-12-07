import { TurboModuleRegistry } from "react-native";

import type { TurboModule } from "react-native";

export interface Spec extends TurboModule {
  readonly getConstants: () => {};

  // methods
  setInputMode(mode: number): void;
  setDefaultMode(): void;
  dismiss(keepFocus: boolean): void;
  setFocusTo(direction: string): void;

  // event emitter
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.get<Spec>("KeyboardController");
