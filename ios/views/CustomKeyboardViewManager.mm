//
//  CustomKeyboardViewManager.mm
//  react-native-keyboard-controller
//
//  Created by Vladyslav Martynov on 11/07/2026.
//

#import "CustomKeyboardViewManager.h"

#if __has_include("react_native_keyboard_controller-Swift.h")
#import "react_native_keyboard_controller-Swift.h"
#else
#import <react_native_keyboard_controller/react_native_keyboard_controller-Swift.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTSurfaceTouchHandler.h>

#import <react/renderer/components/RNKC/EventEmitters.h>
#import <react/renderer/components/RNKC/Props.h>
#import <react/renderer/components/RNKC/RCTComponentViewHelpers.h>
#import <react/renderer/components/RNKC/RNKCCustomKeyboardViewComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#endif

#import <React/RCTShadowView.h>
#import <React/RCTTouchHandler.h>
#import <UIKit/UIKit.h>

// MARK: Shadow view (old architecture)
// The children are re-parented into the keyboard window natively, so the host must
// not occupy space in the layout flow, while the child still needs to be laid out
// against the keyboard width (the height is content-driven). On the new architecture
// the same is done by `CustomKeyboardViewComponentDescriptor::adopt`.
@interface CustomKeyboardShadowView : RCTShadowView
@end

@implementation CustomKeyboardShadowView

- (instancetype)init
{
  if (self = [super init]) {
    self.position = YGPositionTypeAbsolute;
  }
  return self;
}

- (void)insertReactSubview:(RCTShadowView *)subview atIndex:(NSInteger)atIndex
{
  [super insertReactSubview:subview atIndex:atIndex];
  subview.width = (YGValue){static_cast<float>(UIScreen.mainScreen.bounds.size.width), YGUnitPoint};
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

// MARK: Manager
@implementation CustomKeyboardViewManager

RCT_EXPORT_MODULE(CustomKeyboardViewManager)

// Expose the `enabled` prop to React Native
RCT_EXPORT_VIEW_PROPERTY(enabled, BOOL)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifndef RCT_NEW_ARCH_ENABLED
- (UIView *)view
{
  return [[CustomKeyboardView alloc] initWithBridge:self.bridge];
}

- (RCTShadowView *)shadowView
{
  return [CustomKeyboardShadowView new];
}
#endif

@end

// MARK: View
#ifdef RCT_NEW_ARCH_ENABLED
@interface CustomKeyboardView () <RCTCustomKeyboardViewViewProtocol>
@end
#endif

@implementation CustomKeyboardView {
  UIView *_contentView;
  UIView *_sharedInputView;
  __weak UIView<UITextInput> *_attachedInput;
#ifdef RCT_NEW_ARCH_ENABLED
  RCTSurfaceTouchHandler *_touchHandler;
  CustomKeyboardViewShadowNode::ConcreteState::Shared _state;
#else
  RCTTouchHandler *_touchHandler;
#endif
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<CustomKeyboardViewComponentDescriptor>();
}
#endif

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

#ifdef RCT_NEW_ARCH_ENABLED
// MARK: state
- (void)updateState:(const State::Shared &)state oldState:(const State::Shared &)oldState
{
  _state = std::static_pointer_cast<const CustomKeyboardViewShadowNode::ConcreteState>(state);

  auto width = static_cast<facebook::react::Float>(UIScreen.mainScreen.bounds.size.width);
  if (_state && _state->getData().containerWidth != width) {
    _state->updateState(CustomKeyboardViewState(width));
  }
}
#endif

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
  if (self.window == nil) {
    return;
  }

  if (self.enabled) {
    [self attachToTextInput:(UIView *)notification.object];
  } else {
    [self detachInputView];
  }
}

- (void)attachToTextInput:(UIView *)textInput
{
  if ([textInput isKindOfClass:[UITextField class]]) {
    [self attachInputViewTo:(UITextField *)textInput];
  } else if ([textInput isKindOfClass:[UITextView class]]) {
    [self attachInputViewTo:(UITextView *)textInput];
  }
}

- (void)createSharedInputView
{
  CGFloat contentHeight =
      _contentView.subviews.count > 0 ? _contentView.subviews[0].frame.size.height : 0;
  _sharedInputView = [CustomKeyboardContainerView
      createWithFrame:CGRectMake(0, 0, UIScreen.mainScreen.bounds.size.width, contentHeight)
          contentView:_contentView];
}

- (void)attachInputViewTo:(UIView<UITextInput> *)input
{
  if (!_sharedInputView) {
    [self createSharedInputView];
  }

  if (_attachedInput != nil && _attachedInput != input) {
    [self clearInputViewFrom:_attachedInput];
  }

  if ([input isKindOfClass:[UITextField class]]) {
    ((UITextField *)input).inputView = _sharedInputView;
  } else if ([input isKindOfClass:[UITextView class]]) {
    ((UITextView *)input).inputView = _sharedInputView;
  }
  _attachedInput = input;

  [input reloadInputViews];
}

- (void)clearInputViewFrom:(UIView<UITextInput> *)textInput
{
  if ([textInput isKindOfClass:[UITextField class]] &&
      ((UITextField *)textInput).inputView == _sharedInputView) {
    ((UITextField *)textInput).inputView = nil;
  } else if (
      [textInput isKindOfClass:[UITextView class]] &&
      ((UITextView *)textInput).inputView == _sharedInputView) {
    ((UITextView *)textInput).inputView = nil;
  }
}

- (void)detachInputView
{
  UIView<UITextInput> *textInput = _attachedInput;
  if (textInput != nil) {
    [self clearInputViewFrom:textInput];
    [textInput reloadInputViews];
    _attachedInput = nil;
  }
}

// MARK: touch handling
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  return nil;
}

// MARK: props updater
#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newViewProps = *std::static_pointer_cast<const CustomKeyboardViewProps>(props);

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
    [self detachInputView];
  } else {
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
  [_sharedInputView layoutSubviews];
}

// MARK: lifecycle cleanup
- (void)willMoveToWindow:(UIWindow *)newWindow
{
  [super willMoveToWindow:newWindow];

  if (newWindow == nil) {
    [self detachInputView];
  }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle
{
  [super prepareForRecycle];

  [self detachInputView];
  _enabled = NO;
  _sharedInputView = nil;
  _state = nullptr;
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> CustomKeyboardViewCls(void)
{
  return CustomKeyboardView.class;
}
#endif

@end
