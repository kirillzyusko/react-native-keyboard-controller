//
//  RCTBridge.m
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


@interface RCT_EXTERN_MODULE(KeyboardController, RCTEventEmitter)

// Android stubs
RCT_EXTERN_METHOD(setInputMode: (nonnull NSNumber*) mode)
RCT_EXTERN_METHOD(setDefaultMode)

// event emitter
RCT_EXTERN_METHOD(supportedEvents)

// Thanks to this guard, we won't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeKeyboardControllerSpecJSI>(params);
}
#endif

@end
