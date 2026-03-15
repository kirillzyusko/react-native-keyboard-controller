import React, { useEffect } from "react";

type ExpoSnackProps = {
  id: string;
  platform?: string;
  preview?: boolean;
  theme?: string;
};

declare global {
  interface Window {
    ExpoSnack?: { initialize: () => void };
  }
}

const EMBED_SCRIPT_SRC = "https://snack.expo.dev/embed.js";

export default function ExpoSnack({
  id,
  platform = "ios",
  preview = true,
  theme = "light",
}: ExpoSnackProps) {
  useEffect(() => {
    const existing = document.querySelector(
      `script[src="${EMBED_SCRIPT_SRC}"]`,
    );

    if (!existing) {
      const script = document.createElement("script");

      script.src = EMBED_SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    } else if (window.ExpoSnack) {
      window.ExpoSnack.initialize();
    }
  }, []);

  return (
    <div
      data-snack-id={id}
      data-snack-platform={platform}
      data-snack-preview={String(preview)}
      data-snack-theme={theme}
      style={{
        overflow: "hidden",
        background: "#fbfcfd",
        border: "1px solid var(--color-border)",
        borderRadius: 4,
        height: 505,
        width: "100%",
      }}
    />
  );
}
