#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

#include <memory>

namespace facebook::react {

/*
 * State for <OverKeyboardViewState> component.
 */
class OverKeyboardViewState final {
 public:
  using Shared = std::shared_ptr<const OverKeyboardViewState>;


  OverKeyboardViewState() {}
  OverKeyboardViewState(Size screenSize_) : screenSize(screenSize_) {}

#ifdef ANDROID
  OverKeyboardViewState(
      const OverKeyboardViewState& previousState,
      folly::dynamic data)
      : screenSize(Size{
            (Float)data["screenWidth"].getDouble(),
            (Float)data["screenHeight"].getDouble()}) {}
#endif

  const Size screenSize{};

#ifdef ANDROID
  folly::dynamic getDynamic() const;
#endif

#pragma mark - Getters
};

} // namespace facebook::react
