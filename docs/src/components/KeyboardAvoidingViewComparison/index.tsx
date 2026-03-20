import React from "react";

import ComparisonTable from "../ComparisonTable";
import Lottie from "../Lottie";

import after from "./kav-animated.lottie.json";
import before from "./kav.lottie.json";

const After = <Lottie src={after} />;
const Before = <Lottie src={before} />;

export default function KeyboardAvoidingViewComparison(): JSX.Element {
  return (
    <ComparisonTable
      left={Before}
      leftText={
        <i>
          Default <code>react-native</code> implementation on Android
        </i>
      }
      right={After}
      rightText={
        <i>
          Implementation from <code>react-native-keyboard-controller</code> with
          better animations
        </i>
      }
    />
  );
}
