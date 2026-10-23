const { mergeConfig } = require("@react-native/metro-config");

module.exports = mergeConfig(require("./metro.config"), {
  server: {
    rewriteRequestUrl: (url) =>
      url.replace(/\/index\.bundle(?=\?|$)/, "/issue1215.index.bundle"),
  },
});
