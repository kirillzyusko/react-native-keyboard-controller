#pragma once

#include "RNKCOverKeyboardViewShadowNode.h"

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {

class OverKeyboardViewComponentDescriptor final
    : public ConcreteComponentDescriptor<OverKeyboardViewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  void adopt(ShadowNode &shadowNode) const override {
    auto& layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode&>(shadowNode);
    auto& stateData =
        static_cast<const OverKeyboardViewShadowNode::ConcreteState&>(
            *shadowNode.getState())
            .getData();

    layoutableShadowNode.setSize(
        Size{stateData.screenSize.width, stateData.screenSize.height});
    layoutableShadowNode.setPositionType(YGPositionTypeAbsolute);

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
