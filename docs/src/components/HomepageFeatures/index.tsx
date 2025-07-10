import clsx from "clsx";
import Lottie from "lottie-react";
import React from "react";

import crossPlatform from "./cross-platform.lottie.json";
import interactive from "./interactive.lottie.json";
import styles from "./styles.module.css";
import textInputs from "./text-inputs.lottie.json";
import transform from "./transform.lottie.json";
import extender from "./keyboard-extender.lottie.json";
import toolbar from "./toolbar.lottie.json";
import background from "./keyboard-background-view.lottie.json"

type FeatureItem = {
  title: string;
  lottie: Record<string, unknown>;
  description: JSX.Element;
  reversed: boolean;
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
    reversed: false,
  },
  {
    title: "Interactive keyboard",
    lottie: interactive,
    description: <>Control keyboard position via gesture and dismiss your keyboard interactively without a hassle</>,
    reversed: true,
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
    reversed: false,
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
    reversed: true,
  },
  {
    title: "Simplify navigation in large forms",
    lottie: toolbar,
    description: (
      <>
        Utilize <code>KeyboardToolbar</code> capabilities to simplify user navigation between inputs in large forms and enhance experience.
      </>
    ),
    reversed: false,
  },
  {
    title: "Extend keyboard functionality",
    lottie: extender,
    description: (
      <>
        Extend keyboard with own buttons or functionality via <code>KeyboardExtender</code> component
      </>
    ),
    reversed: true,
  },
  {
    title: "Use your imagination!",
    lottie: background,
    description: (
      <>
        Create funny UI with <code>KeyboardBackgroundView</code> that matches keyboard background and give you an ability to invent your own keyboard experience.
      </>
    ),
    reversed: false,
  },
];

const lottieStyle = {
  height: 250,
};

function Feature({ title, lottie, description, reversed }: FeatureItem) {
  return (
    <div
      style={{
        flexDirection: reversed ? "row-reverse" : "row",
        display: "flex",
        padding: 20,
        gap: 30,
        width: "80%",
      }}
    >
      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "40px 70px",
            width: "100%",
            // background:
            //  "linear-gradient(-45deg, rgb(151, 189, 245) 0%, rgb(38, 89, 183) 50%, rgb(37, 139, 222) 100%)",
            borderRadius: 10,
          }}
        >
          <Lottie
            loop
            animationData={lottie}
            className="lottie"
            style={lottieStyle}
          />
        </div>
      </div>
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          // textAlign: reversed ? "end" : "start",
          // paddingTop: 20,
          justifyContent: "center",
        }}
      >
        <h3 className="main-page-h3">{title}</h3>
        <p className="main-page-p">{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{position: "absolute"}}>
    <defs>

    <linearGradient id="fade-mask" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="white" stop-opacity="0" />
      <stop offset="100%" stop-color="white" stop-opacity="1" />
    </linearGradient>
    
    <mask id="mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="320">
      <rect x="0" y="0" width="1440" height="320" fill="url(#fade-mask)" />
    </mask>
  </defs>
    <path 
    fill="#1c1c1c" 
    fill-opacity="0.5"
    mask="url(#mask)"
    d="M0,32L60,32C120,32,240,32,360,42.7C480,53,600,75,720,96C840,117,960,139,1080,128C1200,117,1320,75,1380,53.3L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
  />
</svg>
      <div className="container">
        <h2 className={clsx("text--center main-page-h2")}>Features</h2>
        <div className="row" style={{justifyContent: "center"}}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
