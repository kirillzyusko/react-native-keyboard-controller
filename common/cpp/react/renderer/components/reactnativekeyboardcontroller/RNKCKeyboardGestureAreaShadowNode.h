#pragma once

#include "RNKCKeyboardGestureAreaState.h"

#include <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook::react {

JSI_EXPORT extern const char KeyboardGestureAreaComponentName[];

/*
 * `ShadowNode` for <KeyboardGestureArea> component.
 */
using KeyboardGestureAreaShadowNode = ConcreteViewShadowNode<
    KeyboardGestureAreaComponentName,
    KeyboardGestureAreaProps,
    KeyboardGestureAreaEventEmitter,
    KeyboardGestureAreaState>;

} // namespace facebook::react
