import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

import type { HostComponent } from 'react-native';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {
  DirectEventHandler,
  Double,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { NativeComponentType } from 'react-native/Libraries/Utilities/codegenNativeComponent';

type KeyboardMoveEvent = Readonly<{
  height: Double;
  progress: Double;
  duration: Int32;
  target: Int32;
}>;

type FocusedInputLayoutChangedEvent = Readonly<{
  target: Int32;
  layout: {
    x: Double;
    y: Double;
    width: Double;
    height: Double;
    absoluteX: Double;
    absoluteY: Double;
  };
}>;

export interface NativeProps extends ViewProps {
  // props
  enabled?: boolean;
  statusBarTranslucent?: boolean;
  navigationBarTranslucent?: boolean;
  // callbacks
  onKeyboardMoveStart?: DirectEventHandler<KeyboardMoveEvent>;
  onKeyboardMove?: DirectEventHandler<KeyboardMoveEvent>;
  onKeyboardMoveEnd?: DirectEventHandler<KeyboardMoveEvent>;
  onKeyboardMoveInteractive?: DirectEventHandler<KeyboardMoveEvent>;
  onFocusedInputLayoutChanged?: DirectEventHandler<FocusedInputLayoutChangedEvent>;
}

type KeyboardControllerViewNativeComponentType =
  NativeComponentType<NativeProps>;

interface NativeCommands {
  syncUpFocusedInput: (
    viewRef: React.ElementRef<KeyboardControllerViewNativeComponentType>
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['syncUpFocusedInput'],
});

export default codegenNativeComponent<NativeProps>(
  'KeyboardControllerView'
) as HostComponent<NativeProps>;
