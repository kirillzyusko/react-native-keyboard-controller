#pragma once

#include <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/reactnativekeyboardcontroller/OverKeyboardViewState.h>
#include <jsi/jsi.h>

namespace facebook::react
{

  JSI_EXPORT extern const char OverKeyboardViewComponentName[];
  /*
   * `ShadowNode` for <OverKeyboardView> component.
   */
  class OverKeyboardViewShadowNode final : public ConcreteViewShadowNode<
                                               OverKeyboardViewComponentName,
                                               OverKeyboardViewProps,
                                               OverKeyboardViewEventEmitter,
                                               OverKeyboardViewState>
  {
  public:
    using ConcreteViewShadowNode::ConcreteViewShadowNode;
  };

} // namespace facebook::react