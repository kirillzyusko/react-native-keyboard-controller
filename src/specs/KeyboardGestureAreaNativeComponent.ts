import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

import type { HostComponent } from "react-native";
import type { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import type { WithDefault } from "react-native/Libraries/Types/CodegenTypes";

export interface NativeProps extends ViewProps {
  interpolator?: WithDefault<"linear" | "ios", "linear">;
  showOnSwipeUp?: boolean;
  enableSwipeToDismiss?: boolean;
}

export default codegenNativeComponent<NativeProps>("KeyboardGestureArea", {
  excludedPlatforms: ["iOS"],
}) as HostComponent<NativeProps>;
