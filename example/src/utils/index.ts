export function randomColor() {
  return "#" + Math.random().toString(16).slice(-6);
}

interface ClampLowerParams {
  value: number;
  lowerBound: number;
}

export function clampLower({ value, lowerBound }: ClampLowerParams) {
  return Math.max(value, lowerBound);
}
