//
//  RNKCCustomKeyboardViewComponentDescriptor.h
//  Pods
//
//  Created by Vladyslav Martynov on 11/07/2026.
//

#pragma once

#include "RNKCCustomKeyboardViewShadowNode.h"

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/RNKC/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {
class CustomKeyboardViewComponentDescriptor final
    : public ConcreteComponentDescriptor<CustomKeyboardViewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<CustomKeyboardViewShadowNode *>(&shadowNode));

    auto &layoutableShadowNode = static_cast<YogaLayoutableShadowNode &>(shadowNode);
    auto &stateData =
        static_cast<const CustomKeyboardViewShadowNode::ConcreteState &>(*shadowNode.getState())
            .getData();

  
    layoutableShadowNode.setPositionType(YGPositionTypeAbsolute);
 
    if (stateData.containerWidth > 0) {
      layoutableShadowNode.setSize(Size{stateData.containerWidth, 0});
    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
