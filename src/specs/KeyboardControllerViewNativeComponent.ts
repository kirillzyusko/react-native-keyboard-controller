import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

import type { HostComponent } from "react-native";
import type { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import type {
  DirectEventHandler,
  Double,
  Int32,
} from "react-native/Libraries/Types/CodegenTypes";

type KeyboardMoveEvent = Readonly<{
  height: Double;
  progress: Double;
  duration: Int32;
  target: Int32;
}>;

type FocusedInputLayoutChangedEvent = Readonly<{
  target: Int32;
  parentScrollViewTarget: Int32;
  layout: {
    x: Double;
    y: Double;
    width: Double;
    height: Double;
    absoluteX: Double;
    absoluteY: Double;
  };
}>;

type FocusedInputTextChangedEvent = Readonly<{
  text: string;
}>;

type FocusedInputSelectionChangedEvent = Readonly<{
  target: Int32;
  selection: {
    start: {
      x: Double;
      y: Double;
      position: Int32;
    };
    end: {
      x: Double;
      y: Double;
      position: Int32;
    };
  };
}>;

export interface NativeProps extends ViewProps {
  // props
  enabled?: boolean;
  statusBarTranslucent?: boolean;
  navigationBarTranslucent?: boolean;
  preserveEdgeToEdge?: boolean;
  // callbacks
  /// keyboard
  onKeyboardMoveStart?: DirectEventHandler<KeyboardMoveEvent>;
  onKeyboardMove?: DirectEventHandler<KeyboardMoveEvent>;
  onKeyboardMoveEnd?: DirectEventHandler<KeyboardMoveEvent>;
  onKeyboardMoveInteractive?: DirectEventHandler<KeyboardMoveEvent>;
  /// focused input
  onFocusedInputLayoutChanged?: DirectEventHandler<FocusedInputLayoutChangedEvent>;
  onFocusedInputTextChanged?: DirectEventHandler<FocusedInputTextChangedEvent>;
  onFocusedInputSelectionChanged?: DirectEventHandler<FocusedInputSelectionChangedEvent>;
}

export default codegenNativeComponent<NativeProps>(
  "KeyboardControllerView",
) as HostComponent<NativeProps>;
