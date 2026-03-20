import type { ViewStyle } from "react-native";

type BlurViewProps = {
  blurAmount: number;
  blurType: string;
  reducedTransparencyFallbackColor: string;
  style: ViewStyle;
  children?: React.ReactNode;
};

function BlurView({ blurAmount, children, style }: BlurViewProps) {
  return (
    <div
      style={{
        ...(style as React.CSSProperties),
        filter: `blur(${blurAmount}px)`,
      }}
    >
      {children}
    </div>
  );
}

export default BlurView;
