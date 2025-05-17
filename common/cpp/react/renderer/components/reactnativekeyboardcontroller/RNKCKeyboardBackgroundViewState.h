//
//  RNKCKeyboardBackgroundViewState.h
//  Pods
//
//  Created by Kiryl Ziusko on 18/05/2025.
//

#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

namespace facebook::react {

class KeyboardBackgroundViewState {
 public:
  KeyboardBackgroundViewState() = default;

#ifdef ANDROID
  KeyboardBackgroundViewState(KeyboardBackgroundViewState const &previousState, folly::dynamic data) {}
  folly::dynamic getDynamic() const {
    return {};
  }
#endif
};

} // namespace facebook::react
