const path = require("path");

const { mergeConfig } = require("@react-native/metro-config");

module.exports = mergeConfig(require("./metro.config"), {
  resolver: {
    nodeModulesPaths: [path.join(__dirname, "node_modules")],
  },
  server: {
    rewriteRequestUrl: (url) =>
      url.replace(
        /\/index\.bundle(?=\?|$)/,
        "/issue243.interactive.index.bundle",
      ),
  },
});
