#include "KeyboardControllerComponentsRegistry.h"

#include <CoreComponentsRegistry.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/components/rncore/ComponentDescriptors.h>
#include <react/renderer/components/reactnativekeyboardcontroller/ComponentDescriptors.h>
#include <memory>

namespace facebook {
namespace react {

KeyboardControllerComponentsRegistry::KeyboardControllerComponentsRegistry(
    ComponentFactory *delegate)
    : delegate_(delegate) {}

std::shared_ptr<ComponentDescriptorProviderRegistry const>
KeyboardControllerComponentsRegistry::sharedProviderRegistry() {
  auto providerRegistry = CoreComponentsRegistry::sharedProviderRegistry();

  // react-native-keyboard-controller
  providerRegistry->add(concreteComponentDescriptorProvider<KeyboardControllerViewComponentDescriptor>());

  return providerRegistry;
}

jni::local_ref<KeyboardControllerComponentsRegistry::jhybriddata>
KeyboardControllerComponentsRegistry::initHybrid(
    jni::alias_ref<jclass>,
    ComponentFactory *delegate) {
  auto instance = makeCxxInstance(delegate);

  auto buildRegistryFunction =
      [](EventDispatcher::Weak const &eventDispatcher,
         ContextContainer::Shared const &contextContainer)
      -> ComponentDescriptorRegistry::Shared {
    auto registry = KeyboardControllerComponentsRegistry::sharedProviderRegistry()
                        ->createComponentDescriptorRegistry(
                            {eventDispatcher, contextContainer});

    auto mutableRegistry =
        std::const_pointer_cast<ComponentDescriptorRegistry>(registry);

    mutableRegistry->setFallbackComponentDescriptor(
        std::make_shared<UnimplementedNativeViewComponentDescriptor>(
            ComponentDescriptorParameters{
                eventDispatcher, contextContainer, nullptr}));

    return registry;
  };

  delegate->buildRegistryFunction = buildRegistryFunction;
  return instance;
}

void KeyboardControllerComponentsRegistry::registerNatives() {
  registerHybrid({
      makeNativeMethod("initHybrid", KeyboardControllerComponentsRegistry::initHybrid),
  });

  // This is a temporary solution that allows components exported by react-native-keyboard-controller
  // library to be added to the main component registry. This code is triggered
  // when c++ react-native-keyboard-controller library is initialized and is needed because RN's autolinking
  // does not currently support Fabric components. As a consequence, users would need
  // to manually put library initialization calls in their ReactNativeHost implementation
  // which is undesirable.
  sharedProviderRegistry();
}

} // namespace react
} // namespace facebook
