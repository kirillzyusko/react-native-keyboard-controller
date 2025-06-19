module.exports = {
  dependency: {
    platforms: {
      android: {
        componentDescriptors: [
          "KeyboardControllerViewComponentDescriptor",
          "KeyboardGestureAreaComponentDescriptor",
          "OverKeyboardViewComponentDescriptor",
          "KeyboardBackgroundViewComponentDescriptor",
        ],
        cmakeListsPath: "../android/src/main/jni/CMakeLists.txt",
      },
    },
  },
};
