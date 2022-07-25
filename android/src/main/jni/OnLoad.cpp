#include <fbjni/fbjni.h>

#include "KeyboardControllerComponentsRegistry.h"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
  return facebook::jni::initialize(vm, [] {
    facebook::react::KeyboardControllerComponentsRegistry::registerNatives();
  });
}