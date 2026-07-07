import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";

type ImageProps = {
  src: string;
  width?: number;
  alt?: string;
};

export default function Image({
  src,
  width = 100,
  alt = "",
  ...props
}: ImageProps) {
  const source = useBaseUrl(src);

  return (
    <div className="center image">
      <img alt={alt} src={source} width={`${width}%`} {...props} />
    </div>
  );
}
