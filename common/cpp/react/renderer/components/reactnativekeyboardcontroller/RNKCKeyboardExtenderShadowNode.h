//
//  RNKCKeyboardExtenderShadowNode.h
//  Pods
//
//  Created by Kiryl Ziusko on 25/06/2025.
//

#pragma once

#include "RNKCKeyboardExtenderState.h"

#include <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook::react {

JSI_EXPORT extern const char KeyboardExtenderComponentName[];

/*
 * `ShadowNode` for <KeyboardExtender> component.
 */
using KeyboardExtenderShadowNode = ConcreteViewShadowNode<
    KeyboardExtenderComponentName,
    KeyboardExtenderProps,
    KeyboardExtenderEventEmitter,
    KeyboardExtenderState>;

} // namespace facebook::react
