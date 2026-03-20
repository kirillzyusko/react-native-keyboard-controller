import { codegenNativeComponent } from "react-native";

import type { HostComponent } from "react-native";
import type { ViewProps } from "react-native";
import type { Double } from "react-native/Libraries/Types/CodegenTypes";

export interface NativeProps extends ViewProps {
  contentInsetBottom: Double;
  contentInsetTop: Double;
  applyWorkaroundForContentInsetHitTestBug?: boolean;
}

export default codegenNativeComponent<NativeProps>(
  "ClippingScrollViewDecoratorView",
  {
    interfaceOnly: true,
  },
) as HostComponent<NativeProps>;
