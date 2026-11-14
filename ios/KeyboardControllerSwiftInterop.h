#pragma once

#if SWIFT_PACKAGE
#import "KeyboardControllerSwift.h"
#elif __has_include("react_native_keyboard_controller-Swift.h")
#import "react_native_keyboard_controller-Swift.h"
#else
#import <react_native_keyboard_controller/react_native_keyboard_controller-Swift.h>
#endif
