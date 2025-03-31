import { useColorMode } from "@docusaurus/theme-common";
import React from "react";

import KeyboardVerticalOffsetDark from "./kvo-dark.svg";
import KeyboardVerticalOffsetLight from "./kvo-light.svg";

export default function KeyboardVerticalOffsetIcon() {
  const { colorMode } = useColorMode();

  return (
    <div className="center">
      {colorMode === "dark" ? (
      <KeyboardVerticalOffsetDark className="svg" />
      ) : (
      <KeyboardVerticalOffsetLight className="svg" />)}
    </div>
  );
}
