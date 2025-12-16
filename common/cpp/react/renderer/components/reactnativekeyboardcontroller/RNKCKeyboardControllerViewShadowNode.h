#pragma once

#include "RNKCKeyboardControllerViewState.h"

#include <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook::react {

JSI_EXPORT extern const char KeyboardControllerViewComponentName[];

/*
 * `ShadowNode` for <KeyboardControllerView> component.
 */
using KeyboardControllerViewShadowNode = ConcreteViewShadowNode<
    KeyboardControllerViewComponentName,
    KeyboardControllerViewProps,
    KeyboardControllerViewEventEmitter,
    KeyboardControllerViewState>;

} // namespace facebook::react
