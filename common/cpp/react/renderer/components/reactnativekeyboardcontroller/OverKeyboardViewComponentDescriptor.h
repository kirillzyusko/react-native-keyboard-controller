#pragma once

#include <react/debug/react_native_assert.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/components/reactnativekeyboardcontroller/OverKeyboardViewShadowNode.h>

namespace facebook
{
  namespace react
  {

    class OverKeyboardViewComponentDescriptor final
        : public ConcreteComponentDescriptor<OverKeyboardViewShadowNode>
    {
    public:
      using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
      void adopt(ShadowNode &shadowNode) const override
      {
        react_native_assert(dynamic_cast<OverKeyboardViewShadowNode *>(&shadowNode));
        ConcreteComponentDescriptor::adopt(shadowNode);
      }
    };

  } // namespace react
} // namespace facebook