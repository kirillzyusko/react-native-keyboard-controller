#pragma once

#include <memory>
#include <ComponentFactory.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/componentregistry/ComponentDescriptorRegistry.h>

namespace facebook {
namespace react {

class KeyboardControllerComponentsRegistry
    : public facebook::jni::HybridClass<KeyboardControllerComponentsRegistry> {
 public:
  constexpr static auto kJavaDescriptor =
      "Lcom/reactnativekeyboardcontroller/KeyboardControllerComponentsRegistry;";

  static void registerNatives();

  explicit KeyboardControllerComponentsRegistry(ComponentFactory *delegate);

 private:
  friend HybridBase;

  static std::shared_ptr<ComponentDescriptorProviderRegistry const> sharedProviderRegistry();

  const ComponentFactory *delegate_;

  static jni::local_ref<jhybriddata> initHybrid(
      jni::alias_ref<jclass>,
      ComponentFactory *delegate);
};

} // namespace react
} // namespace facebook
