const path = require("path");

const { mergeConfig } = require("@react-native/metro-config");

const base = require("./metro.config");

module.exports = mergeConfig(base, {
  resolver: {
    nodeModulesPaths: [path.join(__dirname, "node_modules")],
    useWatchman: false,
    blockList: [
      base.resolver.blockList,
      /\/\.argent\/|\/FabricExample\/ios\/(?:build|Pods)\/|\/lib\/typescript\//,
    ].flat(),
  },
  server: {
    rewriteRequestUrl: (url) =>
      process.env.ARGENT_BACK_SWIPE_FULL_APP === "1"
        ? url
        : url.replace(
            /\/index\.bundle(?=\?|$)/,
            "/back-swipe-playground.index.bundle",
          ),
  },
});
