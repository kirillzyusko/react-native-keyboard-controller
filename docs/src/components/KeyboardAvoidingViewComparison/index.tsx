import React from "react";

import ComparisonTable from "../ComparisonTable";

import after from "./kav-animated.lottie.json";
import before from "./kav.lottie.json";

export default function KeyboardAvoidingViewComparison(): JSX.Element {
  return (
    <ComparisonTable
      leftLottie={before}
      leftText={
        <i>
          Default <code>react-native</code> implementation on Android
        </i>
      }
      rightLottie={after}
      rightText={
        <i>
          Implementation from <code>react-native-keyboard-controller</code> with
          better animations
        </i>
      }
    />
  );
}
