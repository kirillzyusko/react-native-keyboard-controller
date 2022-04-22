//
//  RCTBridge.m
//  KeyboardController
//
//  Created by Kiryl Ziusko on 22.04.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(KeyboardController, RCTEventEmitter)

// Android stubs
RCT_EXTERN_METHOD(enable)
RCT_EXTERN_METHOD(setInputMode) // (NSNumber*) mode
RCT_EXTERN_METHOD(setDefaultMode)

// event emitter
RCT_EXTERN_METHOD(supportedEvents)

@end
