module.exports = {
  dependency: {
    platforms: {
      android: {
        componentDescriptors: [
          "KeyboardControllerViewComponentDescriptor",
          "KeyboardGestureAreaComponentDescriptor",
          "OverKeyboardViewComponentDescriptor",
          "KeyboardBackgroundViewComponentDescriptor",
          "ClippingScrollViewDecoratorViewComponentDescriptor",
          "KeyboardToolbarExcludeViewComponentDescriptor",
        ],
        cmakeListsPath: "../android/src/main/jni/CMakeLists.txt",
      },
    },
  },
};
