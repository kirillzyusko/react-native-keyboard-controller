import '@dotlottie/player-component';
import React from 'react';

type Props = {
  src: string;
  style: React.CSSProperties;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': {
        autoplay: boolean;
        loop: boolean;
        mode: 'bounce' | 'normal';
        src: string;
        style: React.CSSProperties;
      };
    }
  }
}

export default function Lottie({ style, src }: Props) {
  return (
    <dotlottie-player autoplay loop mode="normal" src={src} style={style} />
  );
}
