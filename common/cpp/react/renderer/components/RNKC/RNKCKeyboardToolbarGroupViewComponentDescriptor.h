#pragma once

#include "RNKCKeyboardToolbarGroupViewShadowNode.h"

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/RNKC/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {
class KeyboardToolbarGroupViewComponentDescriptor final
    : public ConcreteComponentDescriptor<KeyboardToolbarGroupViewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<KeyboardToolbarGroupViewShadowNode *>(&shadowNode));
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
