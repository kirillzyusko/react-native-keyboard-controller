#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

namespace facebook::react {

class KeyboardToolbarGroupViewState {
 public:
  KeyboardToolbarGroupViewState() = default;

#ifdef ANDROID
  KeyboardToolbarGroupViewState(KeyboardToolbarGroupViewState const &previousState, folly::dynamic data) {}
  folly::dynamic getDynamic() const {
    return {};
  }
#endif
};

} // namespace facebook::react
