//
//  RNKCCustomKeyboardViewShadowNode.h
//  Pods
//
//  Created by Vladyslav Martynov on 11/07/2026.
//

#pragma once

#include "RNKCCustomKeyboardViewState.h"

#include <react/renderer/components/RNKC/EventEmitters.h>
#include <react/renderer/components/RNKC/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook::react {

JSI_EXPORT extern const char CustomKeyboardViewComponentName[];

/*
 * `ShadowNode` for <CustomKeyboardView> component.
 */
using CustomKeyboardViewShadowNode = ConcreteViewShadowNode<
    CustomKeyboardViewComponentName,
    CustomKeyboardViewProps,
    CustomKeyboardViewEventEmitter,
    CustomKeyboardViewState>;

} // namespace facebook::react
