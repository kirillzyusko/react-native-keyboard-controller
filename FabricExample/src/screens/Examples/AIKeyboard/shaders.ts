/**
 * Shared SkSL used by the keyboard-effect shaders.
 *
 * Cyclic, warm-biased palette shared by the keyboard backdrop and the input
 * glow so they stay in sync: amber -> pink -> violet -> blue -> (amber). It
 * deliberately skips green/yellow to match the Apple reference. Prepend this to
 * a shader's source; it defines `vec3 palette(float t)` (uses no uniforms, so
 * it is safe to place before the uniform declarations).
 */
export const PALETTE_SKSL = `
vec3 palette(float t) {
  float x = fract(t) * 4.0;
  int i = int(x);
  float f = smoothstep(0.0, 1.0, fract(x));

  vec3 amber  = vec3(1.00, 0.62, 0.34);
  vec3 pink   = vec3(1.00, 0.40, 0.58);
  vec3 violet = vec3(0.66, 0.42, 1.00);
  vec3 blue   = vec3(0.34, 0.64, 1.00);

  vec3 a = amber;
  vec3 b = pink;
  if (i == 1) { a = pink;   b = violet; }
  else if (i == 2) { a = violet; b = blue; }
  else if (i == 3) { a = blue;   b = amber; }

  return mix(a, b, f);
}
`;
