import React from "react";

import type { CSSProperties } from "react";

const withoutBorders = { border: "none" };
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
  left: React.ReactNode;
  leftText: React.ReactNode;
  right: React.ReactNode;
  rightText: React.ReactNode;
};

export default function ComparisonTable({
  left,
  leftText,
  right,
  rightText,
}: Props): JSX.Element {
  return (
    <table>
      <tbody>
        <tr style={withoutBorders}>
          <td style={withoutBorders}>{left}</td>
          <td style={withoutBorders}>{right}</td>
        </tr>
        <tr style={labels}>
          <td style={label}>{leftText}</td>
          <td style={label}>{rightText}</td>
        </tr>
      </tbody>
    </table>
  );
}
