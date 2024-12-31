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
    img: "https://avatars.githubusercontent.com/u/476779?s=200&v=4",
    alt: "Expensify Mobile App",
    link: "https://github.com/Expensify/App",
    name: "Expensify",
  },
  {
    img: "https://avatars.githubusercontent.com/u/94650532?s=200&v=4",
    alt: "BlueSky Mobile App",
    link: "https://github.com/bluesky-social/social-app",
    name: "BlueSky",
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
    img: "https://avatars.githubusercontent.com/u/95456295?s=200&v=4",
    alt: "RSSNext Follow app",
    link: "https://github.com/RSSNext/Follow",
    name: "Follow",
  },
  {
    img: "https://avatars.githubusercontent.com/u/88587596?s=200&v=4",
    alt: "TonKeeper Wallet app",
    link: "https://github.com/tonkeeper/wallet",
    name: "TON Wallet",
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
    img: "https://avatars.githubusercontent.com/u/79029086?s=200&v=4",
    alt: "Showtime mobile app",
    link: "https://github.com/showtime-xyz/showtime-frontend",
    name: "Showtime",
  },
  {
    img: "https://avatars.githubusercontent.com/u/97704884?s=200&v=4",
    alt: "Converse Messenger",
    link: "https://github.com/ephemeraHQ/converse-app",
    name: "Converse",
  },
  {
    img: "https://avatars.githubusercontent.com/u/6613230?s=200&v=4",
    alt: "Edge App",
    link: "https://github.com/EdgeApp/edge-react-gui",
    name: "Edge",
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
];

function TrustedBy(): JSX.Element {
  return (
    <section className={clsx(styles.trustedBySection)}>
      <h2 class={clsx(styles.trustedByTitle)}>Trusted by</h2>
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
      <p class={clsx(styles.addYourApp)}>
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
