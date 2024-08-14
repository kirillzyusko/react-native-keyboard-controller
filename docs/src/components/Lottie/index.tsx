import LottieReact from "lottie-react";
import React from "react";

type Props = {
  src: unknown;
};
const lottieView = { paddingLeft: "20%", paddingRight: "20%" };

export default function Lottie({ src }: Props): JSX.Element {
  return (
    <LottieReact
      loop
      animationData={src}
      className="lottie"
      style={lottieView}
    />
  );
}
