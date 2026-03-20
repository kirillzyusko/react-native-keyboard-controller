//
//  RNKCKeyboardExtenderState.h
//  Pods
//
//  Created by Kiryl Ziusko on 25/06/2025.
//

#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

namespace facebook::react {

class KeyboardExtenderState {
 public:
  KeyboardExtenderState() = default;

#ifdef ANDROID
  KeyboardExtenderState(KeyboardExtenderState const &previousState, folly::dynamic data) {}
  folly::dynamic getDynamic() const {
    return {};
  }
#endif
};

} // namespace facebook::react
