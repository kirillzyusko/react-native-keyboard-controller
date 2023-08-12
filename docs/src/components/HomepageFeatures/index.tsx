import React from 'react';
import clsx from 'clsx';

import Lottie from '../Lottie';

import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  lottie: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Track each keyboard frame',
    lottie: 'img/transform.lottie',
    description: (
      <>
        Take an advantage of mapping keyboard movement to animated values and
        apply any UI transformations that you can imagine 😎
      </>
    ),
  },
  {
    title: 'Cross platform',
    lottie: 'img/cross-platform.lottie',
    description: (
      <>
        Library uses all power of each platform capabilities and provides
        unified API which works on all platforms.
      </>
    ),
  },
  {
    title: 'Interactive keyboard',
    lottie: 'img/interactive.lottie',
    description: <>Dismiss your keyboard interactively without a hassle</>,
  },
];

const lottieStyle = {
  height: 400,
  marginBottom: 24,
};

function Feature({ title, lottie, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Lottie src={lottie} style={lottieStyle} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
