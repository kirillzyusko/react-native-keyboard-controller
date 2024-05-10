import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";

type VideoProps = {
  src: string;
};

export default function Video({ src, ...props }: VideoProps) {
  const source = useBaseUrl(src);

  return (
    <video
      className="video"
      src={source}
      width="100%"
      height="100%"
      playsInline
      autoPlay
      muted
      loop
      {...props}
    />
  );
}
