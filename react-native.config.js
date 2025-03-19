module.exports = {
  dependency: {
    platforms: {
      android: {
        componentDescriptors: [
          "KeyboardControllerViewComponentDescriptor",
          "KeyboardGestureAreaComponentDescriptor",
          "OverKeyboardViewComponentDescriptor",
        ],
        cmakeListsPath: "../android/src/main/jni/CMakeLists.txt",
      },
    },
  },
};
