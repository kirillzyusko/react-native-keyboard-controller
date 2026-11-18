import useBaseUrl from "@docusaurus/useBaseUrl";
import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./styles.module.css";

type Clip = {
  label: string;
  src: string;
};

type Props = {
  clips: Clip[];
};

function ComparisonVideo({
  clip,
  index,
  register,
  onReady,
}: {
  clip: Clip;
  index: number;
  register: (index: number, video: HTMLVideoElement | null) => void;
  onReady: (index: number) => void;
}) {
  const source = useBaseUrl(clip.src);
  const ref = useCallback(
    (video: HTMLVideoElement | null) => register(index, video),
    [index, register],
  );
  const ready = useCallback(() => onReady(index), [index, onReady]);

  return (
    <figure className={styles.clip}>
      <figcaption>{clip.label}</figcaption>
      <video
        ref={ref}
        controls
        loop
        muted
        playsInline
        aria-label={clip.label}
        preload="auto"
        src={source}
        onCanPlay={ready}
      />
    </figure>
  );
}

export default function VideoComparison({ clips }: Props) {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const loaded = useRef(new Set<number>());
  const [ready, setReady] = useState(false);
  const register = useCallback(
    (index: number, video: HTMLVideoElement | null) => {
      videos.current[index] = video;
    },
    [],
  );
  const onReady = useCallback(
    (index: number) => {
      loaded.current.add(index);
      setReady(loaded.current.size === clips.length);
    },
    [clips.length],
  );
  const replay = useCallback(() => {
    const players = videos.current.filter((video): video is HTMLVideoElement =>
      Boolean(video),
    );

    players.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
    players.forEach((video) => {
      video.play().catch(() => {
        // Browser autoplay restrictions still allow using the video controls.
      });
    });
  }, []);
  const pause = useCallback(() => {
    videos.current.forEach((video) => video?.pause());
  }, []);

  useEffect(() => {
    if (
      ready &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      replay();
    }
  }, [ready, replay]);

  return (
    <div className={styles.comparison}>
      <div className={styles.clips}>
        {clips.map((clip, index) => (
          <ComparisonVideo
            key={clip.src}
            clip={clip}
            index={index}
            register={register}
            onReady={onReady}
          />
        ))}
      </div>
      <div className={styles.controls}>
        <button
          className="button button--secondary button--sm"
          disabled={!ready}
          type="button"
          onClick={replay}
        >
          Replay together
        </button>
        <button
          className="button button--secondary button--sm"
          type="button"
          onClick={pause}
        >
          Pause all
        </button>
      </div>
    </div>
  );
}
