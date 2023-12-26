import Lottie from "lottie-react";
import React from "react";

import type { CSSProperties } from "react";

const withoutBorders = { border: "none" };
const lottieView = { paddingLeft: "20%", paddingRight: "20%" };
const label: CSSProperties = {
  ...withoutBorders,
  maxWidth: 400,
  textAlign: "center",
};
const labels = {
  ...withoutBorders,
  backgroundColor: "#00000000",
};

type Props = {
  leftLottie: unknown;
  leftText: React.ReactNode;
  rightLottie: unknown;
  rightText: React.ReactNode;
};

export default function ComparisonTable({
  leftLottie,
  leftText,
  rightLottie,
  rightText,
}: Props): JSX.Element {
  return (
    <table>
      <tbody>
        <tr style={withoutBorders}>
          <td style={withoutBorders}>
            <Lottie
              className="lottie"
              animationData={leftLottie}
              style={lottieView}
              loop
            />
          </td>
          <td style={withoutBorders}>
            <Lottie
              className="lottie"
              animationData={rightLottie}
              style={lottieView}
              loop
            />
          </td>
        </tr>
        <tr style={labels}>
          <td style={label}>{leftText}</td>
          <td style={label}>{rightText}</td>
        </tr>
      </tbody>
    </table>
  );
}
