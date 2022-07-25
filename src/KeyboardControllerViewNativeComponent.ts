import type { ViewProps } from 'ViewPropTypes';
import type { HostComponent } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type KeyboardMoveEvent = {
  height: number;
  progress: number;
};

export interface NativeProps extends ViewProps {
  //statusBarTranslucent?: boolean;
  //onKeyboardMove?: DirectEventHandler<KeyboardMoveEvent>;
}

export default codegenNativeComponent<NativeProps>(
  'KeyboardControllerView'
) as HostComponent<NativeProps>;
