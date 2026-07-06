import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
} from "@shopify/react-native-skia";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

import { PALETTE_SKSL } from "./shaders";

import type { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";

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
 * Smooth animated "aurora" used as the keyboard backdrop.
 *
 * Unlike a border-glow (which is bright at the edges and hollow in the middle),
 * this sums a handful of large, slowly drifting gaussian color blobs into a
 * single continuous field, then normalizes it — so there is no dark centre and
 * no medial-axis seam. A top-bright vertical fade keeps the glow strongest near
 * the input and dissolves it toward the bottom of the keyboard.
 */
const SKSL =
  PALETTE_SKSL +
  `
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_opacity; // 0 keyboard closed -> 1 open

// One soft gaussian color blob.
vec3 blob(vec2 p, vec2 center, vec3 color, float radius, inout float wSum) {
  float g = exp(-dot(p - center, p - center) / (radius * radius));
  wSum += g;
  return color * g;
}

half4 main(vec2 fragCoord) {
  // x: 0..1 across the width, y: 0..1 down the height.
  vec2 uv = fragCoord / u_resolution;

  float t = u_time * 0.22;   // positional drift
  float ct = u_time * 0.08;  // hue cycle (slow): full amber->...->amber ~12s

  // Four blobs drifting horizontally near the top, at different phases/speeds.
  vec2 c0 = vec2(0.28 + 0.26 * sin(t * 0.70),       0.16 + 0.10 * sin(t * 0.50));
  vec2 c1 = vec2(0.72 + 0.24 * sin(t * 0.90 + 1.7), 0.12 + 0.12 * cos(t * 0.60));
  vec2 c2 = vec2(0.50 + 0.32 * sin(t * 0.55 + 3.1), 0.30 + 0.10 * sin(t * 0.80));
  vec2 c3 = vec2(0.46 + 0.30 * cos(t * 0.65 + 4.6), 0.22 + 0.12 * cos(t * 0.45));

  // Tightly clustered phases: at any instant the blobs share one dominant hue
  // (with gentle adjacent-hue variation across the width), and that dominant
  // hue cycles clearly over time. Spreading these wider muddies it to a
  // constant violet because every hue ends up on screen at once.
  vec3 col0 = palette(ct + 0.00);
  vec3 col1 = palette(ct + 0.09);
  vec3 col2 = palette(ct + 0.18);
  vec3 col3 = palette(ct + 0.27);

  float radius = 0.52;       // larger -> softer, glow reaches further
  float wSum = 0.0;
  vec3 color = vec3(0.0);
  color += blob(uv, c0, col0, radius, wSum);
  color += blob(uv, c1, col1, radius, wSum);
  color += blob(uv, c2, col2, radius, wSum);
  color += blob(uv, c3, col3, radius, wSum);

  // Normalize so gaps between blobs stay fully colored (no dark centre).
  color = color / max(wSum, 0.0001);

  // Mute toward gray. Behind the keyboard this is meant to be a subtle wash,
  // not a vivid fill, so the keys stay readable (matches the Apple reference).
  // 0 = fully gray, 1 = full saturation.
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luma), color, 0.6);

  // Vertical envelope. Both ends use smoothstep so the glow reaches EXACTLY 0
  // with a flat slope at each edge of the box — no hard line at the top (where
  // it melts out of the dark) nor at the bottom (a pow() falloff was steep near
  // the edge and cut off with leftover brightness). It peaks just below the top
  // near the input and dissolves smoothly down over the keys.
  float topRamp = smoothstep(0.0, 0.35, uv.y);
  float bottomFade = smoothstep(0.0, 0.60, 1.0 - uv.y);
  float fade = topRamp * bottomFade;

  // Slight presence falloff where no blob reaches, then a master opacity. Keep
  // this low — the keyboard sits on top, so a little color goes a long way.
  float density = clamp(wSum * 0.9, 0.0, 1.0);
  float alpha = fade * density * 0.45 * u_opacity;

  // Skia runtime shaders output premultiplied color.
  return half4(half3(color * alpha), half(alpha));
}
`;

export type KeyboardGradientProps = {
  /**
   * Height of the backdrop box in px. The glow fills this box from the top
   * (brightest, at the input) and fades to transparent at the bottom, so this
   * should roughly match the keyboard height. @default 500
   */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const KeyboardGradient = ({ height = 500, style }: KeyboardGradientProps) => {
  const effect = useMemo(() => Skia.RuntimeEffect.Make(SKSL), []);
  const clock = useClock();
  // 0 when the keyboard is closed, 1 when fully open -> fades the glow in/out.
  const { progress } = useReanimatedKeyboardAnimation();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const uniforms = useDerivedValue(
    () => ({
      u_resolution: [size.width, size.height],
      u_time: clock.value / 1000,
      u_opacity: progress.value,
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
