//
//  KeyboardExtenderManager.mm
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 13/04/2025.
//

#import "KeyboardExtenderManager.h"

#if __has_include("react_native_keyboard_controller-Swift.h")
#import "react_native_keyboard_controller-Swift.h"
#else
#import <react_native_keyboard_controller/react_native_keyboard_controller-Swift.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTSurfaceTouchHandler.h>

#import <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#import <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#import <react/renderer/components/reactnativekeyboardcontroller/RCTComponentViewHelpers.h>
#import <react/renderer/components/reactnativekeyboardcontroller/RNKCKeyboardExtenderComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#endif

#import <React/RCTTouchHandler.h>
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

// MARK: Manager
@implementation KeyboardExtenderManager

RCT_EXPORT_MODULE(KeyboardExtenderManager)

// Expose the `enabled` prop to React Native
RCT_EXPORT_VIEW_PROPERTY(enabled, BOOL)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifndef RCT_NEW_ARCH_ENABLED
- (UIView *)view
{
  return [[KeyboardExtender alloc] initWithBridge:self.bridge];
}
#endif

@end

// MARK: View
#ifdef RCT_NEW_ARCH_ENABLED
@interface KeyboardExtender () <RCTKeyboardExtenderViewProtocol>
@end
#endif

@implementation KeyboardExtender {
  UIView *_contentView;
  UIView *_sharedInputAccessoryView;
#ifdef RCT_NEW_ARCH_ENABLED
  RCTSurfaceTouchHandler *_touchHandler;
#else
  RCTTouchHandler *_touchHandler;
#endif
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<KeyboardExtenderComponentDescriptor>();
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
    _touchHandler = [RCTSurfaceTouchHandler new];
    _contentView = [[UIView alloc] initWithFrame:CGRectZero];
  }
#else
- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  self = [super initWithFrame:CGRectZero];
  if (self) {
    _touchHandler = [[RCTTouchHandler alloc] initWithBridge:bridge];
    _contentView = [[UIView alloc] initWithFrame:CGRectZero];
  }
#endif
  [_touchHandler attachToView:_contentView];
  [self setupObservers];
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

// MARK: Listeners
- (void)setupObservers
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleTextInputDidBeginEditing:)
                                               name:UITextFieldTextDidBeginEditingNotification
                                             object:nil];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleTextInputDidBeginEditing:)
                                               name:UITextViewTextDidBeginEditingNotification
                                             object:nil];
}

- (void)handleTextInputDidBeginEditing:(NSNotification *)notification
{
  if (self.enabled) {
    [self attachToTextInput:(UIView *)notification.object];
  } else {
    [self detachInputAccessoryView];
  }
}

- (void)attachToTextInput:(UIView *)textInput
{
  if ([textInput isKindOfClass:[UITextField class]]) {
    [self attachInputAccessoryViewTo:(UITextField *)textInput];
  } else if ([textInput isKindOfClass:[UITextView class]]) {
    [self attachInputAccessoryViewTo:(UITextView *)textInput];
  }
}

- (void)createSharedInputAccessoryView
{
  CGRect internalFrame = _contentView.subviews[0].frame;
  _sharedInputAccessoryView = [KeyboardExtenderContainerView
      createWithFrame:CGRectMake(
                          0, 0, UIScreen.mainScreen.bounds.size.width, internalFrame.size.height)
          contentView:_contentView];
}

- (void)attachInputAccessoryViewTo:(UIView<UITextInput> *)input
{
  // Initialize the shared input accessory view once
  if (!_sharedInputAccessoryView) {
    [self createSharedInputAccessoryView];
  }

  // Assign the inputAccessoryView
  if ([input isKindOfClass:[UITextField class]]) {
    ((UITextField *)input).inputAccessoryView = _sharedInputAccessoryView;
  } else if ([input isKindOfClass:[UITextView class]]) {
    ((UITextView *)input).inputAccessoryView = _sharedInputAccessoryView;
  }

  // Refresh input view to apply changes
  [input reloadInputViews];
}

- (void)detachInputAccessoryView
{
  // Remove the accessory view from the current text input
  UIResponder *firstResponder = [UIResponder current];
  if ([firstResponder isKindOfClass:[UITextField class]] ||
      [firstResponder isKindOfClass:[UITextView class]]) {
    UIView<UITextInput> *textInput = (UIView<UITextInput> *)firstResponder;
    if (textInput.inputAccessoryView == _sharedInputAccessoryView) {
      // Assign the inputAccessoryView
      if ([textInput isKindOfClass:[UITextField class]]) {
        ((UITextField *)textInput).inputAccessoryView = nil;
      } else if ([textInput isKindOfClass:[UITextView class]]) {
        ((UITextView *)textInput).inputAccessoryView = nil;
      }
      [textInput reloadInputViews];
    }
  }
}

// MARK: touch handling
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  BOOL canReceiveTouchEvents = ([self isUserInteractionEnabled] && ![self isHidden] && _enabled);
  if (!canReceiveTouchEvents) {
    return nil;
  }

  // `hitSubview` is the topmost subview which was hit. The hit point can
  // be outside the bounds of `view` (e.g., if -clipsToBounds is NO).
  UIView *hitSubview = nil;
  BOOL isPointInside = [self pointInside:point withEvent:event];
  if (![self clipsToBounds] || isPointInside) {
    // TODO: should we take zIndex into consideration?
    // The default behaviour of UIKit is that if a view does not contain a point,
    // then no subviews will be returned from hit testing, even if they contain
    // the hit point. By doing hit testing directly on the subviews, we bypass
    // the strict containment policy (i.e., UIKit guarantees that every ancestor
    // of the hit view will return YES from -pointInside:withEvent:). See:
    //  - https://developer.apple.com/library/ios/qa/qa2013/qa1812.html
    for (UIView *subview in [_contentView.subviews reverseObjectEnumerator]) {
      CGPoint convertedPoint = [subview convertPoint:point fromView:self];
      hitSubview = [subview hitTest:convertedPoint withEvent:event];
      if (hitSubview != nil) {
        break;
      }
    }
  }
  return hitSubview;
}

// MARK: props updater
#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newViewProps = *std::static_pointer_cast<const KeyboardExtenderProps>(props);

  if (newViewProps.enabled != self.enabled) {
    [self updateEnabledState:newViewProps.enabled];
  }

  [super updateProps:props oldProps:oldProps];
}
#else
- (void)setEnabled:(BOOL)enabled
{
  _enabled = enabled;

  [self updateEnabledState:enabled];
}
#endif

- (void)updateEnabledState:(BOOL)enabled
{
  _enabled = enabled;

  if (!enabled) {
    [self detachInputAccessoryView];
  } else {
    // Re-attach if a text input is active
    UIResponder *firstResponder = [UIResponder current];
    if ([firstResponder conformsToProtocol:@protocol(UITextInput)]) {
      [self attachToTextInput:(UIView *)firstResponder];
    }
  }
}

// MARK: child management
#ifdef RCT_NEW_ARCH_ENABLED
- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index
{
  [_contentView insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
}
#else
- (void)addSubview:(UIView *)view
{
  [_contentView addSubview:view];
}
#endif

- (void)layoutSubviews
{
  [_sharedInputAccessoryView layoutSubviews];
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> KeyboardExtenderCls(void)
{
  return KeyboardExtender.class;
}
#endif

@end
