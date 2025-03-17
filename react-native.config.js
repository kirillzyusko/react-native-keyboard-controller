module.exports = {
  dependency: {
    platforms: {
      android: {
        componentDescriptors: ["OverKeyboardViewComponentDescriptor"],
        cmakeListsPath: "../android/src/main/jni/CMakeLists.txt",
      },
    },
  },
};
