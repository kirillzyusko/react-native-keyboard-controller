const { mergeConfig } = require("@react-native/metro-config");

const base = require("./back-swipe-playground.metro.config");

module.exports = mergeConfig(base, {
  server: {
    rewriteRequestUrl: (url) =>
      url.replace(
        /\/index\.bundle(?=\?|$)/,
        "/keyboard-transitions.index.bundle",
      ),
  },
});
