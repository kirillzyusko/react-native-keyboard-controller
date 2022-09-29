module.exports = {
  dependency: {
    platforms: {
      android: {
        libraryName: 'reactnativekeyboardcontroller',
        componentDescriptors: ['KeyboardControllerViewComponentDescriptor'],
        cmakeListsPath: '../android/src/main/jni/CMakeLists.txt',
      },
    },
  },
};
