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
          "KeyboardToolbarGroupViewComponentDescriptor",
        ],
        cmakeListsPath: "../android/src/main/jni/CMakeLists.txt",
      },
    },
  },
};
