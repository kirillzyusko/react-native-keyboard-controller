import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readonly getConstants: () => {};

  // methods
  setInputMode(mode: number): void;
  setDefaultMode(): void;

  // event emitter
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.get<Spec>('KeyboardController');
