//
//  KeyboardControllerModule.m
//  KeyboardController
//
//  Created by Kiryl Ziusko on 22.04.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// Thanks to this guard, we won't import this header when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
#import <FBReactNativeSpec/FBReactNativeSpec.h>
#import <reactnativekeyboardcontroller/reactnativekeyboardcontroller.h>
#endif

#import "KeyboardControllerModule-Header.h"

#if __has_include("react_native_keyboard_controller-Swift.h")
#import "react_native_keyboard_controller-Swift.h"
#else
#import <react_native_keyboard_controller/react_native_keyboard_controller-Swift.h>
#endif

#import <React/RCTEventDispatcherProtocol.h>

#ifdef RCT_NEW_ARCH_ENABLED
@interface KeyboardController () <NativeKeyboardControllerSpec>
@end
#endif

@implementation KeyboardController {
  bool hasListeners;
}

static KeyboardController *shared = nil;

RCT_EXPORT_MODULE()

- (instancetype)init
{
  self = [super init];
  shared = self;

  return self;
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)setDefaultMode
#else
RCT_EXPORT_METHOD(setDefaultMode)
#endif
{
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)setInputMode:(double)mode
#else
RCT_EXPORT_METHOD(setInputMode : (nonnull NSNumber *)mode)
#endif
{
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)dismiss:(BOOL)keepFocus
#else
RCT_EXPORT_METHOD(dismiss : (BOOL)keepFocus)
#endif
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [KeyboardControllerModuleImpl dismiss:keepFocus];
  });
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)setFocusTo:(NSString *)direction
#else
RCT_EXPORT_METHOD(setFocusTo : (nonnull NSString *)direction)
#endif
{
  [ViewHierarchyNavigator setFocusToDirection:direction];
}

+ (KeyboardController *)shared
{
  return shared;
}

- (void)startObserving
{
  hasListeners = YES;
}

- (void)stopObserving
{
  hasListeners = NO;
}

- (void)sendEvent:(NSString *)name body:(id)body
{
  if (hasListeners) {
    [self sendEventWithName:name body:body];
  }
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[
    // keyboard
    @"KeyboardController::keyboardWillShow",
    @"KeyboardController::keyboardDidShow",
    @"KeyboardController::keyboardWillHide",
    @"KeyboardController::keyboardDidHide",
    // focused input
    @"KeyboardController::focusDidSet",
  ];
}

// Thanks to this guard, we won't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeKeyboardControllerSpecJSI>(params);
}
#endif

@end
