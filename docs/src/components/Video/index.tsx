import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";

type VideoProps = {
  src: string;
  width?: number;
};

export default function Video({ src, width = 100, ...props }: VideoProps) {
  const source = useBaseUrl(src);

  return (
    <div className="center video">
      <video
        src={source}
        width={`${width}%`}
        height="100%"
        playsInline
        autoPlay
        muted
        loop
        {...props}
      />
    </div>
  );
}
