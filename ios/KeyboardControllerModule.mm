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
- (void)windowPosition:(double)viewTag
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
#else
RCT_EXPORT_METHOD(windowPosition
                  : (nonnull NSNumber *)viewTag resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)
#endif
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSInteger tag;
#ifdef RCT_NEW_ARCH_ENABLED
    tag = (NSInteger)viewTag;
#else
    tag = viewTag.integerValue;
#endif
    UIWindow *window = nil;
    for (UIScene *scene in UIApplication.sharedApplication.connectedScenes) {
      if (scene.activationState == UISceneActivationStateForegroundActive &&
          [scene isKindOfClass:[UIWindowScene class]]) {
        UIWindowScene *windowScene = (UIWindowScene *)scene;
        for (UIWindow *w in windowScene.windows) {
          if (w.isKeyWindow) {
            window = w;
            break;
          }
        }
        if (window)
          break;
      }
    }
    UIView *view = [window viewWithTag:tag];
    if (!view) {
      reject(@"E_VIEW_NOT_FOUND", @"Could not find view for tag", nil);
      return;
    }
    // Use UIKit coordinate conversion to get true window coordinates.
    // This bypasses Fabric's shadow tree which returns surface-relative
    // coordinates for views inside Modals (RN bug #52450).
    CGRect windowFrame = [view.superview convertRect:view.frame toView:nil];
    resolve(@{
      @"x" : @(windowFrame.origin.x),
      @"y" : @(windowFrame.origin.y),
      @"width" : @(windowFrame.size.width),
      @"height" : @(windowFrame.size.height),
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
