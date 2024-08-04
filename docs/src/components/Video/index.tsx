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
        autoPlay
        loop
        muted
        playsInline
        height="100%"
        src={source}
        width={`${width}%`}
        {...props}
      />
    </div>
  );
}
