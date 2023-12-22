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
- (void)dismiss
#else
RCT_EXPORT_METHOD(dismiss)
#endif
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[UIApplication sharedApplication] sendAction:@selector(resignFirstResponder)
                                               to:nil
                                             from:nil
                                         forEvent:nil];
  });
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
    @"KeyboardController::keyboardWillShow",
    @"KeyboardController::keyboardDidShow",
    @"KeyboardController::keyboardWillHide",
    @"KeyboardController::keyboardDidHide",
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
