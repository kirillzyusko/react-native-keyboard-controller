#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

namespace facebook::react {

class KeyboardToolbarExcludeViewState {
 public:
  KeyboardToolbarExcludeViewState() = default;

#ifdef ANDROID
  KeyboardToolbarExcludeViewState(KeyboardToolbarExcludeViewState const &previousState, folly::dynamic data) {}
  folly::dynamic getDynamic() const {
    return {};
  }
#endif
};

} // namespace facebook::react
