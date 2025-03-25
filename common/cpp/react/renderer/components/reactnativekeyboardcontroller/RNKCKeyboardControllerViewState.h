#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

namespace facebook::react {

class KeyboardControllerViewState {
 public:
  KeyboardControllerViewState() = default;

#ifdef ANDROID
  KeyboardControllerViewState(KeyboardControllerViewState const &previousState, folly::dynamic data) {}
  folly::dynamic getDynamic() const {
    return {};
  }
#endif
};

} // namespace facebook::react
