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
#import <RNKC/RNKC.h>
#endif

#import "KeyboardControllerModule-Header.h"

#if __has_include("react_native_keyboard_controller-Swift.h")
#import "react_native_keyboard_controller-Swift.h"
#else
#import <react_native_keyboard_controller/react_native_keyboard_controller-Swift.h>
#endif

#import <React/RCTEventDispatcherProtocol.h>
#ifndef RCT_NEW_ARCH_ENABLED
#import <React/RCTUIManager.h>
#endif

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

- (NSDictionary *)constantsToExport
{
  return @{
    @"keyboardBorderRadius" : @([KeyboardExtenderContainerView keyboardBorderRadius]),
  };
}

- (NSDictionary *)getConstants
{
  return [self constantsToExport];
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
- (void)preload
#else
RCT_EXPORT_METHOD(preload)
#endif
{
  [UIResponder preloadKeyboardIfNeeded];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)dismiss:(BOOL)keepFocus animated:(BOOL)animated
#else
RCT_EXPORT_METHOD(dismiss : (BOOL)keepFocus animated : (BOOL)animated)
#endif
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [KeyboardControllerModuleImpl dismiss:keepFocus animated:animated];
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

#ifdef RCT_NEW_ARCH_ENABLED
- (void)viewPositionInWindow:(double)viewTag
                     resolve:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject
#else
RCT_EXPORT_METHOD(viewPositionInWindow
                  : (nonnull NSNumber *)viewTag resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)
#endif
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *view = nil;
#ifdef RCT_NEW_ARCH_ENABLED
    NSInteger tag = (NSInteger)viewTag;
    view = [UIApplication.sharedApplication.activeWindow viewWithTag:tag];
#else
    view = [self.bridge.uiManager viewForReactTag:viewTag];
#endif
    if (!view || !view.superview) {
      reject(@"E_VIEW_NOT_FOUND", @"Could not find view for tag", nil);
      return;
    }
    CGRect frame = [view.superview convertRect:view.frame toView:nil];
    resolve(@{
      @"x" : @(frame.origin.x),
      @"y" : @(frame.origin.y),
      @"width" : @(frame.size.width),
      @"height" : @(frame.size.height),
    });
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
    // keyboard
    @"KeyboardController::keyboardWillShow",
    @"KeyboardController::keyboardDidShow",
    @"KeyboardController::keyboardWillHide",
    @"KeyboardController::keyboardDidHide",
    // focused input
    @"KeyboardController::focusDidSet",
    @"KeyboardController::layoutDidSynchronize",
    // window dimensions
    @"KeyboardController::windowDidResize",
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
