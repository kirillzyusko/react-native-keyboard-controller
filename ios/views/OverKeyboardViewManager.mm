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

#import <React/RCTTouchHandler.h>
#import <UIKit/UIKit.h>

@implementation OverKeyboardViewManager

RCT_EXPORT_MODULE(OverKeyboardViewManager)

// Expose the `visible` prop to React Native
RCT_EXPORT_VIEW_PROPERTY(visible, BOOL)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (UIView *)view {
  return [[OverKeyboardView alloc] initWithFrame:CGRectZero bridge:self.bridge];
}

@end

@implementation OverKeyboardView {
    UIView *_contentView;
    RCTTouchHandler *_touchHandler;
}

- (instancetype)initWithFrame:(CGRect)frame bridge:(RCTBridge *)bridge {
    self = [super initWithFrame:frame];
    if (self) {
        _contentView = [[UIView alloc] initWithFrame:CGRectZero];
        
        // Eagerly initialize the observer
        [UIWindow sharedKeyboardWindowObserver];
        
        _touchHandler = [[RCTTouchHandler alloc] initWithBridge:bridge];
    }
    return self;
}

- (void)setVisible:(BOOL)visible {
    _visible = visible;
    if (_visible) {
        [self showInLastWindow];
    } else {
        [self hide];
    }
}

- (void)addSubview:(UIView *)view {
    [_contentView addSubview:view];
}

- (void)showInLastWindow {
    _contentView.frame = self.window.bounds;
    _contentView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    UIWindow *topWindow = [UIWindow topWindow];
    [topWindow addSubview:_contentView];
    
    [_touchHandler attachToView:_contentView];
}

- (void)hide {
    if (_contentView.subviews.count > 0) {
        [_contentView removeFromSuperview];
        [_touchHandler detachFromView:_contentView];
    }
}

@end
