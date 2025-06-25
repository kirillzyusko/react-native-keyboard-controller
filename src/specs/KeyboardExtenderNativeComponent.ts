import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

import type { HostComponent } from "react-native";
import type { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";

export interface NativeProps extends ViewProps {
  enabled?: boolean;
}

export default codegenNativeComponent<NativeProps>("KeyboardExtender", {
  interfaceOnly: true,
  excludedPlatforms: ["android"],
}) as HostComponent<NativeProps>;
