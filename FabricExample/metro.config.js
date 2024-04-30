const path = require("path");

const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const escape = require("escape-string-regexp");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const pack = require("../package.json");

const root = path.resolve(__dirname, "..");

const modules = Object.keys(pack.peerDependencies);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we exclude them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blacklistRE: exclusionList(
      modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(root, "node_modules", m))}\\/.*$`),
      ),
    ),

    extraNodeModules: modules.reduce(
      (acc, name) => {
        acc[name] = path.join(__dirname, "node_modules", name);
        return acc;
      },
      {
        // required from RN 0.73
        "react-native-keyboard-controller": path.join(
          __dirname,
          "node_modules",
          "react-native-keyboard-controller",
        ),
      },
    ),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
