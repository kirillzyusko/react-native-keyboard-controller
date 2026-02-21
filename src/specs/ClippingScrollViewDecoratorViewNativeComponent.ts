import { codegenNativeComponent } from "react-native";

import type { HostComponent } from "react-native";
import type { ViewProps } from "react-native";
import type { Double } from "react-native/Libraries/Types/CodegenTypes";

export interface NativeProps extends ViewProps {
  contentInsetBottom: Double;
  contentInsetTop: Double;
}

export default codegenNativeComponent<NativeProps>(
  "ClippingScrollViewDecoratorView",
  {
    interfaceOnly: true,
    excludedPlatforms: ["iOS"],
  },
) as HostComponent<NativeProps>;
