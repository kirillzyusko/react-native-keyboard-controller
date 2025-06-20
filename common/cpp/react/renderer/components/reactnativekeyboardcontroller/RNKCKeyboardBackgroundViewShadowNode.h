//
//  RNKCKeyboardBackgroundViewShadowNode.h
//  Pods
//
//  Created by Kiryl Ziusko on 18/05/2025.
//

#pragma once

#include "RNKCKeyboardBackgroundViewState.h"

#include <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#include <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook::react {

JSI_EXPORT extern const char KeyboardBackgroundViewComponentName[];

/*
 * `ShadowNode` for <KeyboardBackgroundView> component.
 */
using KeyboardBackgroundViewShadowNode = ConcreteViewShadowNode<
    KeyboardBackgroundViewComponentName,
    KeyboardBackgroundViewProps,
    KeyboardBackgroundViewEventEmitter,
    KeyboardBackgroundViewState>;

} // namespace facebook::react
