
/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateComponentDescriptorH.js
 */

#pragma once

#include "ShadowNodes.h"

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class KeyboardControllerViewComponentDescriptor final
    : public ConcreteComponentDescriptor<KeyboardControllerViewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<KeyboardControllerViewShadowNode *>(&shadowNode));
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

class OverKeyboardViewComponentDescriptor final
    : public ConcreteComponentDescriptor<OverKeyboardViewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<OverKeyboardViewShadowNode *>(&shadowNode));
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

class KeyboardGestureAreaComponentDescriptor final
    : public ConcreteComponentDescriptor<KeyboardGestureAreaShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<KeyboardGestureAreaShadowNode *>(&shadowNode));
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace react
} // namespace facebook
