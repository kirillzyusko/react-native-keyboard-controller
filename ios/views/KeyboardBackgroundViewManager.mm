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

#import <React/RCTView.h>
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

typedef NS_ENUM(NSInteger, KeyboardBackdropStyle) {
  KeyboardBackdropStyleDark = 2030,
  KeyboardBackdropStyleLight = 3901
};

@protocol KeyboardBackdropViewProtocol <NSObject>
@optional
- (instancetype)initWithFrame:(CGRect)frame style:(long long)style;
- (void)transitionToStyle:(long long)style;
@end

#pragma mark - Manager

@implementation KeyboardBackgroundViewManager

RCT_EXPORT_MODULE(KeyboardBackgroundViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifndef RCT_NEW_ARCH_ENABLED
- (UIView *)view
{
  RCTView *containerView = [[RCTView alloc] initWithFrame:CGRectZero];
  containerView.clipsToBounds = YES;

  KeyboardBackgroundView *backgroundView =
      [[KeyboardBackgroundView alloc] initWithFrame:containerView.bounds];
  backgroundView.autoresizingMask =
      UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  [containerView addSubview:backgroundView];

  return containerView;
}
#endif

@end

#pragma mark - View

#ifdef RCT_NEW_ARCH_ENABLED
@interface KeyboardBackgroundView () <RCTKeyboardBackgroundViewViewProtocol>
#else
@interface KeyboardBackgroundView ()
#endif
@end

@implementation KeyboardBackgroundView {
  UIVisualEffectView *_backdropView;
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

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    [self setupBackdropView];
  }
  self.clipsToBounds = YES;
  return self;
}

- (void)setupBackdropView
{
  Class BackdropClass = NSClassFromString(@"UIKBBackdropView");
  if (BackdropClass) {
    long long style = (self.traitCollection.userInterfaceStyle == UIUserInterfaceStyleDark)
        ? KeyboardBackdropStyleDark
        : KeyboardBackdropStyleLight;

    id<KeyboardBackdropViewProtocol> backdrop =
        (id<KeyboardBackdropViewProtocol>)[BackdropClass alloc];
    backdrop = [backdrop initWithFrame:self.bounds style:style];

    if ([backdrop isKindOfClass:[UIVisualEffectView class]]) {
      _backdropView = (UIVisualEffectView *)backdrop;
      _backdropView.layer.masksToBounds = YES;
      _backdropView.autoresizingMask =
          UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
      _backdropView.frame = self.bounds;
      [self addSubview:_backdropView];
    }
  } else {
    NSLog(@"KeyboardBackdropView class not found");
  }
}

// MARK: child management
#ifdef RCT_NEW_ARCH_ENABLED
- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index
{
  // preserve slot 0 for blur layer
  [super mountChildComponentView:childComponentView index:index + 1];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index
{
  // preserve slot 0 for blur layer
  [super unmountChildComponentView:childComponentView index:index + 1];
}
#endif

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
  [super traitCollectionDidChange:previousTraitCollection];

  if (@available(iOS 12.0, *)) {
    if ([previousTraitCollection
            hasDifferentColorAppearanceComparedToTraitCollection:self.traitCollection]) {
      long long style = (self.traitCollection.userInterfaceStyle == UIUserInterfaceStyleDark)
          ? KeyboardBackdropStyleDark
          : KeyboardBackdropStyleLight;

      if ([_backdropView respondsToSelector:@selector(transitionToStyle:)]) {
        [(id<KeyboardBackdropViewProtocol>)_backdropView transitionToStyle:style];
      }
    }
  }
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> KeyboardBackgroundViewCls(void)
{
  return KeyboardBackgroundView.class;
}
#endif

@end
