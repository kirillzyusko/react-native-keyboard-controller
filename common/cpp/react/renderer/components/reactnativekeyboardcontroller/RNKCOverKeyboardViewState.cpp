#include "RNKCOverKeyboardViewState.h"

namespace facebook::react {

#ifdef ANDROID
folly::dynamic OverKeyboardViewState::getDynamic() const {
  return folly::dynamic::object("screenWidth", screenSize.width)(
      "screenHeight", screenSize.height);
}
#endif

} // namespace facebook::react
