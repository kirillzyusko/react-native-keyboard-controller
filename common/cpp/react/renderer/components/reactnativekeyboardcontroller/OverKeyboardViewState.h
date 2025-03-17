#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

namespace facebook::react
{

  class OverKeyboardViewState
  {
  public:
    OverKeyboardViewState() = default;
#ifdef ANDROID
    OverKeyboardViewState(OverKeyboardViewState const &previousState, folly::dynamic data) {};
    folly::dynamic getDynamic() const
    {
      return {};
    };
#endif
  };

} // namespace facebook::react