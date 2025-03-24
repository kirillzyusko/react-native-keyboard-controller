#pragma once

#include "RNKCKeyboardGestureAreaShadowNode.h"

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {
class KeyboardGestureAreaComponentDescriptor final
    : public ConcreteComponentDescriptor<KeyboardGestureAreaShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<KeyboardGestureAreaShadowNode *>(&shadowNode));
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
