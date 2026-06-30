import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
} from "@shopify/react-native-skia";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

import type { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";

/**
 * Smooth animated "aurora" used as the keyboard backdrop.
 *
 * Unlike a border-glow (which is bright at the edges and hollow in the middle),
 * this sums a handful of large, slowly drifting gaussian colour blobs into a
 * single continuous field, then normalises it — so there is no dark centre and
 * no medial-axis seam. A top-bright vertical fade keeps the glow strongest near
 * the input and dissolves it toward the bottom of the keyboard.
 */
const SKSL = `
uniform vec2 u_resolution;
uniform float u_time;

// One soft gaussian colour blob.
vec3 blob(vec2 p, vec2 center, vec3 color, float radius, inout float wsum) {
  float g = exp(-dot(p - center, p - center) / (radius * radius));
  wsum += g;
  return color * g;
}

half4 main(vec2 fragCoord) {
  // x: 0..1 across the width, y: 0..1 down the height.
  vec2 uv = fragCoord / u_resolution;

  float t = u_time * 0.25;

  // Four blobs drifting horizontally near the top, at different phases/speeds.
  vec2 c0 = vec2(0.30 + 0.28 * sin(t * 0.70),       0.16 + 0.10 * sin(t * 0.50));
  vec2 c1 = vec2(0.70 + 0.26 * sin(t * 0.90 + 1.7), 0.10 + 0.12 * cos(t * 0.60));
  vec2 c2 = vec2(0.50 + 0.34 * sin(t * 0.55 + 3.1), 0.30 + 0.10 * sin(t * 0.80));
  vec2 c3 = vec2(0.45 + 0.30 * cos(t * 0.65 + 4.6), 0.22 + 0.12 * cos(t * 0.45));

  vec3 col0 = vec3(1.00, 0.16, 0.56); // magenta / pink
  vec3 col1 = vec3(0.62, 0.32, 1.00); // violet
  vec3 col2 = vec3(1.00, 0.52, 0.26); // warm orange
  vec3 col3 = vec3(0.16, 0.62, 1.00); // blue

  float radius = 0.42;
  float wsum = 0.0;
  vec3 color = vec3(0.0);
  color += blob(uv, c0, col0, radius, wsum);
  color += blob(uv, c1, col1, radius, wsum);
  color += blob(uv, c2, col2, radius, wsum);
  color += blob(uv, c3, col3, radius, wsum);

  // Normalise so gaps between blobs stay fully coloured (no dark centre).
  color = color / max(wsum, 0.0001);

  // Vertical envelope. The top edge fades IN (0 → 1 over the first ~14%) so the
  // glow melts out of the dark area above instead of starting on a hard line;
  // it then carries down over the keys and dissolves toward the bottom. pow < 1
  // on the falloff keeps the middle bright (a square would crush keys to gray).
  float topRamp = smoothstep(0.0, 0.14, uv.y);
  float bottomFade = pow(clamp(1.0 - uv.y, 0.0, 1.0), 0.7);
  float fade = topRamp * bottomFade;

  // Slight presence falloff where no blob reaches, then a master opacity.
  float density = clamp(wsum * 0.9, 0.0, 1.0);
  float alpha = fade * density * 0.95;

  // Skia runtime shaders output premultiplied colour.
  return half4(half3(color * alpha), half(alpha));
}
`;

export type KeyboardGradientProps = {
  /**
   * Height of the backdrop box in px. The glow fills this box from the top
   * (brightest, at the input) and fades to transparent at the bottom, so this
   * should roughly match the keyboard height. @default 380
   */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const KeyboardGradient = ({ height = 420, style }: KeyboardGradientProps) => {
  const effect = useMemo(() => Skia.RuntimeEffect.Make(SKSL), []);
  const clock = useClock();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const uniforms = useDerivedValue(
    () => ({
      u_resolution: [size.width, size.height],
      u_time: clock.value / 1000,
    }),
    [size.width, size.height],
  );

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;

    setSize((s) =>
      s.width === width && s.height === h ? s : { width, height: h },
    );
  }, []);

  return (
    <View style={[{ height }, style]} onLayout={onLayout}>
      {effect !== null && size.width > 0 && (
        <Canvas style={StyleSheet.absoluteFill}>
          <Fill>
            <Shader source={effect} uniforms={uniforms} />
          </Fill>
        </Canvas>
      )}
    </View>
  );
};

export default KeyboardGradient;
