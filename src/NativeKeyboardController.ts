import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readonly getConstants: () => {};

  setInputMode(mode: number): void;
  setDefaultMode(): void;
}

export default TurboModuleRegistry.get<Spec>('KeyboardController');
