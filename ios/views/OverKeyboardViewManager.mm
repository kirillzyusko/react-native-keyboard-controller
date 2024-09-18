//
//  OverKeyboardViewManager.mm
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 11/09/2024.
//

#import "OverKeyboardViewManager.h"

#if __has_include("react_native_keyboard_controller-Swift.h")
#import "react_native_keyboard_controller-Swift.h"
#else
#import <react_native_keyboard_controller/react_native_keyboard_controller-Swift.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTSurfaceTouchHandler.h>

#import <react/renderer/components/reactnativekeyboardcontroller/ComponentDescriptors.h>
#import <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#import <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#import <react/renderer/components/reactnativekeyboardcontroller/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#endif

#import <React/RCTTouchHandler.h>
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

// MARK: Manager
@implementation OverKeyboardViewManager

RCT_EXPORT_MODULE(OverKeyboardViewManager)

// Expose the `visible` prop to React Native
RCT_EXPORT_VIEW_PROPERTY(visible, BOOL)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

#ifndef RCT_NEW_ARCH_ENABLED
- (UIView *)view {
  return [[OverKeyboardView alloc] initWithBridge:self.bridge];
}
#endif

@end

// MARK: View
#ifdef RCT_NEW_ARCH_ENABLED
@interface OverKeyboardView () <RCTOverKeyboardViewViewProtocol>
@end
#endif

@implementation OverKeyboardView {
    UIView *_contentView;
#ifdef RCT_NEW_ARCH_ENABLED
  RCTSurfaceTouchHandler *_touchHandler;
#else
    RCTTouchHandler *_touchHandler;
#endif
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<OverKeyboardViewComponentDescriptor>();
}
#endif

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
  
  // Eagerly initialize the observer
  [UIWindow sharedKeyboardWindowObserver];
}

// MARK: Constructor
#ifdef RCT_NEW_ARCH_ENABLED
- (instancetype)init {
    NSLog(@"123");
    if (self = [super init]) {
        _touchHandler = [RCTSurfaceTouchHandler new];
        _contentView = [[UIView alloc] initWithFrame:CGRectZero];
      }
      return self;
}
#else
- (instancetype)initWithBridge:(RCTBridge *)bridge {
    self = [super initWithFrame:CGRectZero];
    if (self) {
        _contentView = [[UIView alloc] initWithFrame:CGRectZero];
        
        _touchHandler = [[RCTTouchHandler alloc] initWithBridge:bridge];
    }
    return self;
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<const OverKeyboardViewProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const OverKeyboardViewProps>(props);

  if (newViewProps.visible != oldViewProps.visible) {
    if (newViewProps.visible) {
      [self show];
    } else {
      [self hide];
    }
  }

  [super updateProps:props oldProps:oldProps];
}
#endif

#ifndef RCT_NEW_ARCH_ENABLED
- (void)setVisible:(BOOL)visible {
    if (visible) {
        [self show];
    } else {
        [self hide];
    }
}
#endif

- (void)addSubview:(UIView *)view {
    [_contentView addSubview:view];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [_contentView insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [childComponentView removeFromSuperview];
}
#endif

- (void)show {
    if (_visible) {
        return;
    }
    _visible = true;
    _contentView.frame = self.window.bounds;
    _contentView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    UIWindow *topWindow = [UIWindow topWindow];
    [topWindow addSubview:_contentView];
    
    [_touchHandler attachToView:_contentView];
}

- (void)hide {
    if (!_visible) {
        return;
    }
    _visible = false;
    [_contentView removeFromSuperview];
    [_touchHandler detachFromView:_contentView];
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> OverKeyboardViewCls(void)
{
  return OverKeyboardView.class;
}
#endif

@end
