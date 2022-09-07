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
#import "RNKeyboardControllerSpec.h"
#endif

#import "KeyboardControllerModule-Header.h"

#import <FBReactNativeSpec/FBReactNativeSpec.h>
#import <React/RCTEventDispatcherProtocol.h>

@interface KeyboardController () <NativeKeyboardControllerSpec>
@end

@implementation KeyboardController {
    bool hasListeners;
}

static KeyboardController *shared = nil;

RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    shared = self;
    
    return self;
}

- (void)setDefaultMode {
}

- (void)setInputMode:(double)mode {
}

+ (KeyboardController*)shared
{
    return shared;
}

-(void)startObserving {
    hasListeners = YES;
}

-(void)stopObserving {
    hasListeners = NO;
}

-(void)sendEvent:(NSString *)name body:(id)body {
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

