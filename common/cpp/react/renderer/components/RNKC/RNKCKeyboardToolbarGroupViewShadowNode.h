#pragma once

#include "RNKCKeyboardToolbarGroupViewState.h"

#include <react/renderer/components/RNKC/EventEmitters.h>
#include <react/renderer/components/RNKC/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <jsi/jsi.h>

namespace facebook::react {

JSI_EXPORT extern const char KeyboardToolbarGroupViewComponentName[];

/*
 * `ShadowNode` for <KeyboardToolbarGroupView> component.
 */
using KeyboardToolbarGroupViewShadowNode = ConcreteViewShadowNode<
    KeyboardToolbarGroupViewComponentName,
    KeyboardToolbarGroupViewProps,
    KeyboardToolbarGroupViewEventEmitter,
    KeyboardToolbarGroupViewState>;

} // namespace facebook::react
