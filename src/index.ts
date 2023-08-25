import './monkey-patch';

export * from './bindings';
export * from './animated';
export * from './replicas';
export * from './context';
export * from './hooks';
export * from './constants';
export * from './types';

// TODO: I'd like to import it as `react-native-keyboard-controller/components`
import { KeyboardAvoidingView } from './components';

export { KeyboardAvoidingView };
