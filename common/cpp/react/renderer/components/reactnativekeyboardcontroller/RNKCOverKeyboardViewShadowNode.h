#pragma once

#include "RNKCOverKeyboardViewState.h"

#include <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook::react {

JSI_EXPORT extern const char OverKeyboardViewComponentName[];

/*
 * `ShadowNode` for <OverKeyboardView> component.
 */
using OverKeyboardViewShadowNode = ConcreteViewShadowNode<
    OverKeyboardViewComponentName,
    OverKeyboardViewProps,
    OverKeyboardViewEventEmitter,
    OverKeyboardViewState>;

} // namespace facebook::react
