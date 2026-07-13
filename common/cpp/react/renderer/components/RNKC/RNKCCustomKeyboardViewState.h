//
//  RNKCCustomKeyboardViewState.h
//  Pods
//
//  Created by Vladyslav Martynov on 11/07/2026.
//

#pragma once

#include <react/renderer/core/graphicsConversions.h>
#include <react/renderer/graphics/Float.h>

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

#include <memory>

namespace facebook::react {

class CustomKeyboardViewState final {
 public:
  using Shared = std::shared_ptr<const CustomKeyboardViewState>;

  CustomKeyboardViewState() = default;
  explicit CustomKeyboardViewState(Float width) : containerWidth(width) {}

  Float containerWidth{0};

#ifdef ANDROID
  CustomKeyboardViewState(CustomKeyboardViewState const &previousState, folly::dynamic data)
      : containerWidth(static_cast<Float>(data["containerWidth"].getDouble())) {}
  folly::dynamic getDynamic() const {
    return folly::dynamic::object("containerWidth", containerWidth);
  }
#endif
};

} // namespace facebook::react
