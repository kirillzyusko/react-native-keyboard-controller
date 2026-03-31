import { TurboModuleRegistry } from "react-native";

import type { TurboModule } from "react-native";

export interface Spec extends TurboModule {
  readonly getConstants: () => {
    keyboardBorderRadius: number;
  };

  // methods
  setInputMode(mode: number): void;
  setDefaultMode(): void;
  preload(): void;
  dismiss(keepFocus: boolean, animated: boolean): void;
  setFocusTo(direction: string): void;
  viewPositionInWindow(viewTag: number): Promise<object>;

  // event emitter
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.get<Spec>("KeyboardController");
