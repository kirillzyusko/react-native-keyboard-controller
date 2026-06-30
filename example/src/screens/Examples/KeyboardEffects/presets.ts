import type { PresetConfig } from "react-native-animated-glow";

/**
 * `react-native-animated-glow` preset for the focused text input — an animated
 * rainbow border with layered outer glow, plus brighter `hover`/`press` states.
 */
export const input: PresetConfig = {
  metadata: {
    name: "Default Rainbow",
    textColor: "#FFFFFF",
    textSize: 16,
    category: "Gradient",
    tags: ["colorful", "rainbow", "vibrant", "skia"],
  },
  states: [
    {
      name: "default",
      preset: {
        cornerRadius: 30,
        outlineWidth: 4,
        borderColor: [
          "rgba(238, 255, 0, 1)",
          "rgba(79, 255, 0, 1)",
          "rgba(46, 90, 255, 1)",
          "rgba(254, 0, 255, 1)",
          "rgba(231, 23, 23, 1)",
        ],
        backgroundColor: "rgba(10, 10, 10, 1)",
        animationSpeed: 1.2,
        borderSpeedMultiplier: 1,
        glowLayers: [
          {
            glowPlacement: "behind",
            colors: [
              "rgba(205, 201, 35, 1)",
              "rgba(0, 255, 79, 1)",
              "rgba(0, 119, 255, 1)",
              "rgba(239, 0, 255, 1)",
              "rgba(222, 28, 28, 1)",
            ],
            glowSize: 34,
            opacity: 0.2,
            speedMultiplier: 1,
            coverage: 1,
            relativeOffset: 0,
          },
          {
            glowPlacement: "behind",
            colors: [
              "rgba(185, 182, 32, 1)",
              "rgba(0, 255, 79, 1)",
              "rgba(0, 119, 255, 1)",
              "rgba(239, 0, 255, 1)",
              "rgba(222, 28, 28, 1)",
            ],
            glowSize: 6,
            opacity: 0.5,
            speedMultiplier: 1,
            coverage: 1,
            relativeOffset: 0,
          },
          {
            glowPlacement: "behind",
            colors: ["#FFFFFF"],
            glowSize: [2, 8, 8, 2],
            opacity: 0.2,
            speedMultiplier: 2,
            coverage: 0.5,
            relativeOffset: 0,
          },
        ],
      },
    },
    {
      name: "hover",
      transition: 300,
      preset: {
        animationSpeed: 1.8,
        glowLayers: [
          {
            glowSize: 40,
            opacity: 0.24,
          },
          {
            glowSize: 7,
            opacity: 0.6,
          },
          {
            glowSize: [2, 10, 10, 2],
            opacity: 0.24,
          },
        ],
      },
    },
    {
      name: "press",
      transition: 100,
      preset: {
        animationSpeed: 2.4,
        glowLayers: [
          {
            glowSize: 40,
            opacity: 0.28,
          },
          {
            glowSize: 8,
            opacity: 0.7,
          },
          {
            glowSize: [3, 11, 11, 3],
            opacity: 0.28,
          },
        ],
      },
    },
  ],
};
