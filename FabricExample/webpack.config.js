const fs = require("fs");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const appDirectory = fs.realpathSync(process.cwd());
const { presets, plugins } = require(`${appDirectory}/babel.config.js`);

// Get node_modules paths (both current project and parent)
const rootNodeModules = path.resolve(appDirectory, "node_modules");
const parentNodeModules = path.resolve(appDirectory, "..", "node_modules");

// Function to get module path (check both locations)
function getModulePath(moduleName) {
  const localPath = path.resolve(appDirectory, `node_modules/${moduleName}`);
  const parentPath = path.resolve(
    appDirectory,
    `../node_modules/${moduleName}`,
  );

  if (fs.existsSync(localPath)) {
    return localPath;
  }
  if (fs.existsSync(parentPath)) {
    return parentPath;
  }

  return localPath; // fallback
}

const compileNodeModules = [
  // React Native and related
  "react-native",
  "react-native-web",
  "react-native-worklets",
  "react-native-reanimated",
  "react-native-gesture-handler",
  "react-native-screens",
  "react-native-safe-area-context",
  "@lottiefiles/dotlottie-react",
  "@gorhom/bottom-sheet",

  // Navigation
  "@react-navigation/native",
  "@react-navigation/elements",
  "@react-navigation/native-stack",
  "@react-navigation/stack",
  "@react-navigation/bottom-tabs",
  "@react-navigation/core",
  "@react-navigation/routers",

  // Other packages that need babel processing
  "react-native-toast-message",
].map((moduleName) => getModulePath(moduleName));

const keyboardControllerSrc = path.resolve(__dirname, "..", "src");

const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  include: [
    path.resolve(__dirname, "index.web.js"),
    path.resolve(__dirname, "src", "App.tsx"),
    path.resolve(__dirname, "src"),
    path.resolve(__dirname, "component"),
    keyboardControllerSrc,
    ...compileNodeModules,
  ],
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      presets,
      plugins,
    },
  },
  type: "javascript/auto",
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: "@svgr/webpack",
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: "url-loader",
    options: {
      name: "[name].[ext]",
    },
  },
};

module.exports = {
  ignoreWarnings: [
    {
      // worklet is a new library, so let's simply ignore it :)
      module: /react-native-worklets[\\/]/,
      message: /Critical dependency: require function is used in a way/,
    },
  ],
  entry: {
    app: path.join(__dirname, "index.web.js"),
  },
  output: {
    path: path.resolve(appDirectory, "dist"),
    publicPath: "/",
    filename: "rnw.bundle.js",
  },
  resolve: {
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
    ],
    alias: {
      "react-native$": "react-native-web",
      "react-native-keyboard-controller": keyboardControllerSrc,
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    // Add both node_modules directories
    modules: [rootNodeModules, parentNodeModules, "node_modules"],
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
    new webpack.EnvironmentPlugin({ JEST_WORKER_ID: null }),
    new webpack.DefinePlugin({ process: { env: {} } }),
  ],
  devServer: {
    server: "https",
    host: "0.0.0.0",
    port: 8080,
    hot: true,
    historyApiFallback: true,
  },
};
