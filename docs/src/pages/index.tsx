import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/installation"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

const trustedBy = [
  {
    img: "https://avatars.githubusercontent.com/u/1965106?s=200&v=4",
    alt: "Discord Mobile App",
    link: "https://play.google.com/store/apps/details?id=com.discord",
    name: "Discord",
  },
  {
    img: "https://avatars.githubusercontent.com/u/476779?s=200&v=4",
    alt: "Expensify Mobile App",
    link: "https://github.com/Expensify/App",
    name: "Expensify",
  },
  {
    img: "https://play-lh.googleusercontent.com/VsgCCgW-ct98JhgVoQzndWCAaXxlP6uMwcjzINYPmeja8cCNISsJDqDFNQrF2IRq9xM=w200-h480-rw",
    alt: "Bluesky mobile app",
    link: "https://github.com/bluesky-social/social-app",
    name: "Bluesky",
  },
  {
    img: "https://avatars.githubusercontent.com/u/12504344?s=200&v=4",
    alt: "Expo framework",
    link: "https://docs.expo.dev/guides/keyboard-handling/",
    name: "Expo",
  },
  {
    img: "https://avatars.githubusercontent.com/u/3902527?s=200&v=4",
    alt: "InfiniteRed Ignite react native project boilerplate",
    link: "https://github.com/infinitered/ignite",
    name: "Ignite",
  },
  {
    img: "https://avatars.githubusercontent.com/u/36115574?s=200&v=4",
    alt: "Uniswap Mobile App",
    link: "https://github.com/Uniswap/interface",
    name: "Uniswap",
  },
  {
    img: "https://avatars.githubusercontent.com/u/12508788?s=200&v=4",
    alt: "Rocket Chat Mobile App",
    link: "https://github.com/RocketChat/Rocket.Chat.ReactNative",
    name: "Rocket Chat",
  },
  {
    img: "https://avatars.githubusercontent.com/u/48327834?s=200&v=4",
    alt: "Rainbow Mobile App",
    link: "https://github.com/rainbow-me/rainbow",
    name: "Rainbow",
  },
  {
    img: "https://avatars.githubusercontent.com/u/95456295?s=200&v=4",
    alt: "RSSNext Follow app",
    link: "https://github.com/RSSNext/Follow",
    name: "Follow",
  },
  {
    img: "https://avatars.githubusercontent.com/u/23416667?s=200&v=4",
    alt: "Chatwoot mobile app",
    link: "https://github.com/chatwoot/chatwoot-mobile-app",
    name: "Chatwoot",
  },
  {
    img: "https://avatars.githubusercontent.com/u/4201786?s=200&v=4",
    alt: "Obytes react native project template",
    link: "https://github.com/obytes/react-native-template-obytes",
    name: "Obytes",
  },
  {
    img: "https://avatars.githubusercontent.com/u/431672?s=200&v=4",
    alt: "Minds app",
    link: "https://github.com/Minds/mobile-native",
    name: "Minds",
  },
  {
    img: "https://avatars.githubusercontent.com/u/61685601?s=200&v=4",
    alt: "OneKey: Crypto DeFi Wallet App",
    link: "https://github.com/OneKeyHQ/app-monorepo",
    name: "OneKey",
  },
  {
    img: "https://avatars.githubusercontent.com/u/79029086?s=200&v=4",
    alt: "Showtime mobile app",
    link: "https://github.com/showtime-xyz/showtime-frontend",
    name: "Showtime",
  },
  {
    img: "https://avatars.githubusercontent.com/u/6613230?s=200&v=4",
    alt: "Edge App",
    link: "https://github.com/EdgeApp/edge-react-gui",
    name: "Edge",
  },
  {
    img: "https://play-lh.googleusercontent.com/4G1ZS2y5ekD1eRgpOahOj6v_vq1UlN0VVNcmHFFIS2SFGotr3vbZStS_6RZU8l4G7Ryy=w200-h480-rw",
    alt: "Pixelfed App",
    link: "https://github.com/pixelfed/pixelfed-rn",
    name: "Pixelfed",
  },
  {
    img: "https://play-lh.googleusercontent.com/xs4ZUIOATV_bGfdl2yd0mWev9bcK2_a4ofnUEIIQe2_BecUqOVQ7YmtXu41Ereg0Kg=w200-h480-rw",
    alt: "Trezor Suite App",
    link: "https://github.com/trezor/trezor-suite",
    name: "Trezor Suite",
  },
  {
    img: "https://play-lh.googleusercontent.com/BFYQT9Pugt8shdo75MjFZh5F_IMn7btSj8mXknbvSfmVV6JASCKQqcLcERvGdD0iN8A=w200-h480-rw",
    alt: "PocketPal AI App",
    link: "https://github.com/a-ghorbani/pocketpal-ai",
    name: "PocketPal AI",
  },
  {
    img: "https://avatars.githubusercontent.com/u/7648832?s=200&v=4",
    alt: "Kitsu App",
    link: "https://github.com/hummingbird-me/kitsu-mobile",
    name: "Kitsu",
  },
  {
    img: "https://play-lh.googleusercontent.com/KsXljWMtBXw131OcLT44ByxwznfdgM1a-2gZVYNBzPBKz9gqOCxEIhC83IpS35OIZQc=w200-h480-rw",
    alt: "Drakula: Watch Videos App",
    link: "https://play.google.com/store/apps/details?id=app.drakula",
    name: "Drakula",
  },
  {
    img: "https://avatars.githubusercontent.com/u/47886602?s=200&v=4",
    alt: "Swan: the easiest way to add a banking SDK to your app",
    link: "https://github.com/swan-io/swan-partner-mobile",
    name: "Swan",
  },
];

function TrustedBy(): JSX.Element {
  return (
    <section className={clsx(styles.trustedBySection)}>
      <h2 className={clsx(styles.trustedByTitle)}>Trusted by</h2>
      <div className={clsx(styles.trustedByContainer)}>
        {trustedBy.map((item, index) => (
          <a key={index} href={item.link} target="_blank">
            <img
              alt={item.alt}
              className={clsx(styles.trustedByImg)}
              src={item.img}
            />
            <h4>{item.name}</h4>
          </a>
        ))}
      </div>
      <p className={clsx(styles.addYourApp)}>
        Would like to show your project here?{" "}
        <a href="https://github.com/kirillzyusko/react-native-keyboard-controller/edit/main/docs/src/pages/index.tsx">
          Submit a PR
        </a>
      </p>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      description={siteConfig.tagline}
      title={`React Native Keyboard Controller · Control each frame of keyboard movement`}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <TrustedBy />
      </main>
    </Layout>
  );
}
