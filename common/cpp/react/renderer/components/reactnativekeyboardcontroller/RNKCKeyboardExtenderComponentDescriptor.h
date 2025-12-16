//
//  RNKCKeyboardExtenderComponentDescriptor.h
//  Pods
//
//  Created by Kiryl Ziusko on 25/06/2025.
//

#pragma once

#include "RNKCKeyboardExtenderShadowNode.h"

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {
class KeyboardExtenderComponentDescriptor final
    : public ConcreteComponentDescriptor<KeyboardExtenderShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<KeyboardExtenderShadowNode *>(&shadowNode));
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
