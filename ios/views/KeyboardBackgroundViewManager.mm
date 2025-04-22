//
//  KeyboardBackgroundViewManager.mm
//  Pods
//
//  Created by Kiryl Ziusko on 21/04/2025.
//

#import "KeyboardBackgroundViewManager.h"

#if __has_include("react_native_keyboard_controller-Swift.h")
#import "react_native_keyboard_controller-Swift.h"
#else
#import <react_native_keyboard_controller/react_native_keyboard_controller-Swift.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#import <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#import <react/renderer/components/reactnativekeyboardcontroller/RCTComponentViewHelpers.h>
#import <react/renderer/components/reactnativekeyboardcontroller/RNKCKeyboardBackgroundViewComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#endif

#import <UIKit/UIKit.h>

#import <objc/message.h>

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

// MARK: Manager
@implementation KeyboardBackgroundViewManager

RCT_EXPORT_MODULE(KeyboardBackgroundViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifndef RCT_NEW_ARCH_ENABLED
- (UIView *)view
{
  Class BackdropClass = NSClassFromString(@"UIKBBackdropView");
  if (BackdropClass) {
      CGRect frame = CGRectMake(0, 0, 320, 200); // Your desired frame
      long long style = 2030; // Use the appropriate style (private value)
      
      // Use objc_msgSend with proper casting to call the initializer
      id backdropView = ((id (*)(id, SEL, CGRect, long long))objc_msgSend)(
          [BackdropClass alloc],
          @selector(initWithFrame:style:),
          frame,
          style
      );
      
      // Use backdropView (cast to UIView/UIVisualEffectView if needed)
      if ([backdropView isKindOfClass:[UIVisualEffectView class]]) {
          UIVisualEffectView *visualEffectView = (UIVisualEffectView *)backdropView;
        
        visualEffectView.layer.masksToBounds = YES;
        
        return visualEffectView;
          // Add to your view hierarchy
      }
  } else {
      NSLog(@"UIKBBackdropView class not found.");
  }

  return nil;
  // return [[KeyboardBackgroundView alloc] initWithFrame:CGRectZero];
}
#endif

@end

// MARK: View
#ifdef RCT_NEW_ARCH_ENABLED
@interface KeyboardBackgroundView () <RCTKeyboardBackgroundViewViewProtocol>
#else
@interface KeyboardBackgroundView ()
#endif
@end

@implementation KeyboardBackgroundView {
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<KeyboardBackgroundViewComponentDescriptor>();
}
#endif

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

// MARK: Constructor
#ifdef RCT_NEW_ARCH_ENABLED
- (instancetype)init
{
  if (self = [super init]) {
  }
  return self;
}
#else
- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  self = [super initWithFrame:CGRectZero];
  if (self) {
  }

  return self;
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> KeyboardBackgroundViewCls(void)
{
  return KeyboardBackgroundView.class;
}
#endif

@end
