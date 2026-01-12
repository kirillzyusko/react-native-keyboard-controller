#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

namespace facebook::react {

class KeyboardGestureAreaState {
 public:
  KeyboardGestureAreaState() = default;

#ifdef ANDROID
  KeyboardGestureAreaState(KeyboardGestureAreaState const &previousState, folly::dynamic data) {}
  folly::dynamic getDynamic() const {
    return {};
  }
#endif
};

} // namespace facebook::react
