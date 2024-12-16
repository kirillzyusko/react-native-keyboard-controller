// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

let baseUrl = "/react-native-keyboard-controller/";

if (process.env.PREVIEW_PATH) {
  baseUrl += process.env.PREVIEW_PATH;
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Keyboard Controller",
  tagline: "Control each frame of keyboard movement in react native",
  url: "https://kirillzyusko.github.io",
  baseUrl: baseUrl,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "kirillzyusko",
  projectName: "react-native-keyboard-controller",
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/",
          versions: {
            "1.0.0": {
              label: "1.0.0-1.3.0",
            },
            "1.4.0": {
              label: "1.4.0",
            },
            "1.5.0": {
              label: "1.5.0",
            },
            "1.6.0": {
              label: "1.6.0",
            },
            "1.7.0": {
              label: "1.7.0",
            },
            "1.8.0": {
              label: "1.8.0",
            },
            "1.9.0": {
              label: "1.9.0",
            },
            "1.10.0": {
              label: "1.10.0",
            },
            "1.11.0": {
              label: "1.11.0",
            },
            "1.12.0": {
              label: "1.12.0",
            },
            "1.13.0": {
              label: "1.13.0",
            },
            "1.14.0": {
              label: "1.14.0",
            },
            "1.15.0": {
              label: "1.15.0",
            },
          },
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-4JH9YK1X2Q",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/og-image.png",
      navbar: {
        title: "Keyboard Controller",
        logo: {
          alt: "Keyboard Controller Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Guides",
          },
          {
            to: "/docs/category/api-reference",
            label: "API",
            position: "left",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            type: "docsVersionDropdown",
            position: "left",
            dropdownActiveClassDisabled: true,
          },
          {
            href: "https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example",
            label: "Example App",
            position: "right",
          },
          {
            href: "https://github.com/kirillzyusko/react-native-keyboard-controller",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Guides",
                to: "/docs/installation",
              },
              {
                label: "Recipes",
                to: "/docs/category/recipes",
              },
              {
                label: "API",
                to: "/docs/category/api-reference",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub discussions",
                href: "https://github.com/kirillzyusko/react-native-keyboard-controller/discussions",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/ziusko",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/kirillzyusko/react-native-keyboard-controller",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Kirill Zyusko. Built with Docusaurus.`,
      },
      prism: {
        additionalLanguages: [
          "java",
          "kotlin",
          "swift",
          "json",
          "diff",
          "bash",
        ],
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        magicComments: [
          // Remember to extend the default highlight class name as well!
          {
            className: "theme-code-block-highlighted-line",
            line: "highlight-next-line",
            block: { start: "highlight-start", end: "highlight-end" },
          },
          {
            className: "code-block-add-line",
            line: "add-new-code",
          },
        ],
      },
      metadata: [
        {
          name: "keywords",
          content:
            "react-native, keyboard, animation, ios, android, interactive keyboard dismiss, avoid keyboard, keyboard avoiding view, keyboard aware scroll view, sticky keyboard view, keyboard toolbar",
        },
        { name: "og:image:width", content: "2400" },
        { name: "og:image:height", content: "1426" },
      ],
      algolia: {
        appId: "CX4YXK1FST",
        apiKey: "38ac854aece5593cbb4cc70c303d742e",
        indexName: "react-native-keyboard-controller",
        contextualSearch: true,
        searchParameters: {},
        searchPagePath: false,
      },
    }),
};

module.exports = config;
