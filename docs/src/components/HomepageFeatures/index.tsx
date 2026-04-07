import clsx from "clsx";
import Lottie from "lottie-react";
import React from "react";

import crossPlatform from "./cross-platform.lottie.json";
import interactive from "./interactive.lottie.json";
import styles from "./styles.module.css";
import textInputs from "./text-inputs.lottie.json";
import transform from "./transform.lottie.json";

type FeatureItem = {
  title: string;
  lottie: Record<string, unknown>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Track each keyboard frame",
    lottie: transform,
    description: (
      <>
        Take an advantage of mapping keyboard movement to animated values and
        apply any UI transformations that you can imagine 😎
      </>
    ),
  },
  {
    title: "Interactive keyboard",
    lottie: interactive,
    description: <>Dismiss your keyboard interactively without a hassle</>,
  },
  {
    title: "Cross platform",
    lottie: crossPlatform,
    description: (
      <>
        Library uses all power of each platform capabilities and provides
        unified API which works on all platforms.
      </>
    ),
  },
  {
    title: "Rich metadata",
    lottie: textInputs,
    description: (
      <>
        Take a power of enhanced metadata and check how easily you can control
        each aspect of the keyboard movement
      </>
    ),
  },
];

function Feature({
  title,
  lottie,
  description,
  index,
}: FeatureItem & { index: number }) {
  const isReversed = index % 2 !== 0;

  return (
    <div
      className={clsx(
        styles.featureRow,
        isReversed && styles.featureRowReverse,
      )}
    >
      <div className={styles.featureText}>
        <div className={styles.featureNumber}>Feature {String(index + 1).padStart(2, "0")}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.featureAnimation}>
        <Lottie
          loop
          animationData={lottie}
          className="lottie"
          style={{ height: 380 }}
        />
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} index={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
