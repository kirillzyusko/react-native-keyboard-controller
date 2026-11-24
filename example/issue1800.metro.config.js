const path = require("path");

const { mergeConfig } = require("@react-native/metro-config");

const fixture = path.resolve(__dirname, "../FabricExample/issue1800.index.js");
const regression = path.resolve(
  __dirname,
  "../FabricExample/issue1800.regression.js",
);
const start = path.resolve(__dirname, "../FabricExample/issue1800.start.js");
const entry = path.resolve(__dirname, "index.js");

module.exports = mergeConfig(require("./metro.config"), {
  resolver: {
    resolveRequest(context, name, platform) {
      if (
        context.originModulePath === fixture &&
        name === "./issue1800.regression"
      ) {
        return { type: "sourceFile", filePath: regression };
      }
      if (
        context.originModulePath === fixture &&
        name === "./issue1800.start"
      ) {
        return { type: "sourceFile", filePath: start };
      }
      if (
        context.originModulePath === fixture ||
        context.originModulePath === regression ||
        context.originModulePath === start
      ) {
        return context.resolveRequest(
          { ...context, originModulePath: entry },
          name,
          platform,
        );
      }
      const result = context.resolveRequest(context, name, platform);

      return result.type === "sourceFile" && result.filePath === entry
        ? { type: "sourceFile", filePath: fixture }
        : result;
    },
  },
});
