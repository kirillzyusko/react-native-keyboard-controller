import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
} from "@shopify/react-native-skia";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

import { PALETTE_SKSL } from "./shaders";

import type { LayoutChangeEvent } from "react-native";

const useReanimatedKeyboardAnimation = () => {
  const progress = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        // eslint-disable-next-line react-compiler/react-compiler
        progress.value = e.progress;
      },
    },
    [],
  );

  return { progress };
};

/**
 * Glowing text input, drawn with Skia.
 *
 * The shader takes the signed distance to a rounded rectangle and lays a soft
 * gaussian halo plus a tighter bright rim on top of it. Color is a two-hue split
 * across the width (left <-> right) sampled from the shared palette, so it
 * cycles over time in sync with the keyboard backdrop.
 */
const SKSL =
  PALETTE_SKSL +
  `
uniform vec2 u_resolution;  // canvas size incl. margin (px)
uniform vec2 u_rectSize;    // pill size (px)
uniform float u_radius;     // corner radius (px)
uniform float u_time;
uniform float u_opacity;    // 0 keyboard closed -> 1 open

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

half4 main(vec2 fragCoord) {
  vec2 center = u_resolution * 0.5;
  vec2 p = fragCoord - center;
  vec2 b = u_rectSize * 0.5;
  float dist = abs(sdRoundRect(p, b, u_radius)); // distance to the border

  float ct = u_time * 0.08; // same speed as the backdrop -> hues stay in sync

  // Two adjacent hues split left -> right across the pill, both cycling.
  float hx = clamp(p.x / max(b.x, 1.0) * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(palette(ct), palette(ct + 0.12), hx);

  // Soft halo + tight bright rim, both centred on the border.
  float halo = exp(-dist * dist / (2.0 * 26.0 * 26.0)) * 0.40;
  float rim  = exp(-dist * dist / (2.0 *  8.0 *  8.0)) * 0.60;

  // Force the glow to 0 before the canvas edge. The canvas only extends
  // margin px past the pill, so without this the halo would be clipped into
  // a hard rectangle wherever it is still bright at that boundary.
  float margin = (u_resolution.x - u_rectSize.x) * 0.5;
  float edgeFade = 1.0 - smoothstep(margin * 0.5, margin, dist);

  float alpha = clamp(halo + rim, 0.0, 1.0) * edgeFade * u_opacity;

  // Skia runtime shaders output premultiplied color.
  return half4(half3(col * alpha), half(alpha));
}
`;

// Padding the canvas adds around the pill. The shader fades the glow to 0 by
// this distance (edgeFade), so it should comfortably exceed the halo reach.
const MARGIN = 90;
const CORNER_RADIUS = 25;

const GlowInput = () => {
  const effect = useMemo(() => Skia.RuntimeEffect.Make(SKSL), []);
  const clock = useClock();
  const { progress } = useReanimatedKeyboardAnimation();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const uniforms = useDerivedValue(
    () => ({
      u_resolution: [size.width + MARGIN * 2, size.height + MARGIN * 2],
      u_rectSize: [size.width, size.height],
      u_radius: CORNER_RADIUS,
      u_time: clock.value / 1000,
      u_opacity: progress.value,
    }),
    [size.width, size.height],
  );

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;

    setSize((s) =>
      s.width === width && s.height === height ? s : { width, height },
    );
  }, []);

  const canvasStyle = useMemo(
    () => ({
      position: "absolute" as const,
      left: -MARGIN,
      top: -MARGIN,
      width: size.width + MARGIN * 2,
      height: size.height + MARGIN * 2,
    }),
    [size.width, size.height],
  );

  return (
    <View>
      {effect !== null && size.width > 0 && (
        <Canvas pointerEvents="none" style={canvasStyle}>
          <Fill>
            <Shader source={effect} uniforms={uniforms} />
          </Fill>
        </Canvas>
      )}
      <TextInput
        keyboardAppearance="dark"
        placeholder="Describe an image..."
        style={styles.input}
        onLayout={onLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: CORNER_RADIUS,
    backgroundColor: "#FFFFFF",
  },
});

export default GlowInput;
