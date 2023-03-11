import type { HostComponent } from 'react-native';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface NativeProps extends ViewProps {
  interpolator: 'linear' | 'ios';
  allowToShowKeyboardFromHiddenStateBySwipeUp?: boolean;
  allowToDragKeyboardFromShownStateBySwipes?: boolean;
}

export default codegenNativeComponent<NativeProps>(
  'KeyboardGestureArea'
) as HostComponent<NativeProps>;
