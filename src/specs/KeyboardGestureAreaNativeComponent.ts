import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

import type { HostComponent } from "react-native";
import type { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import type {
  Double,
  WithDefault,
} from "react-native/Libraries/Types/CodegenTypes";

export interface NativeProps extends ViewProps {
  interpolator?: WithDefault<"linear" | "ios", "linear">;
  showOnSwipeUp?: boolean;
  enableSwipeToDismiss?: boolean;
  offset?: Double;
}

export default codegenNativeComponent<NativeProps>("KeyboardGestureArea", {
  excludedPlatforms: ["iOS"],
}) as HostComponent<NativeProps>;
