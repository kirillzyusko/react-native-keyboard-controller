//
//  KeyboardGestureAreaManager.mm
//  Pods
//
//  Created by Kiryl Ziusko on 01/11/2024.
//

#import "KeyboardGestureAreaManager.h"

#if __has_include("react_native_keyboard_controller-Swift.h")
#import "react_native_keyboard_controller-Swift.h"
#else
#import <react_native_keyboard_controller/react_native_keyboard_controller-Swift.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/reactnativekeyboardcontroller/ComponentDescriptors.h>
#import <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#import <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#import <react/renderer/components/reactnativekeyboardcontroller/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#endif

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

// MARK: Manager
@implementation KeyboardGestureAreaManager

RCT_EXPORT_MODULE(KeyboardGestureAreaManager)

// Expose props to React Native
RCT_EXPORT_VIEW_PROPERTY(textInputNativeID, NSString *)
RCT_EXPORT_VIEW_PROPERTY(offset, NSNumber *)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifndef RCT_NEW_ARCH_ENABLED
- (UIView *)view
{
  return [[KeyboardGestureArea alloc] initWithBridge:self.bridge];
}
#endif

@end

// MARK: View
#ifdef RCT_NEW_ARCH_ENABLED
@interface KeyboardGestureArea () <RCTKeyboardGestureAreaViewProtocol>
#else
@interface KeyboardGestureArea ()
#endif
@end

@implementation KeyboardGestureArea {
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<KeyboardGestureAreaComponentDescriptor>();
}
#endif

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];

  // TODO: initialize swizzling here? Or in constructor?
  [UIResponder swizzleResignFirstResponder];
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

// MARK: lifecycle methods
- (void)didMoveToSuperview
{
  if (self.superview == nil) {
    // unmounted
    [[KeyboardOffsetProvider shared] removeOffsetForTextInputNativeID:_textInputNativeID withTag:self.reactTag];
  }
}

// MARK: props updater
#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<const KeyboardGestureAreaProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const KeyboardGestureAreaProps>(props);

  // TODO: implement logic with provider

  [super updateProps:props oldProps:oldProps];
}
#else
- (void)setOffset:(NSNumber *)offset
{
  // [[KeyboardOffsetProvider shared] removeOffsetForTextInputNativeID:_textInputNativeID];
  [[KeyboardOffsetProvider shared] setOffsetForTextInputNativeID:_textInputNativeID offset:offset withTag: self.reactTag];
  _offset = offset;
}

- (void)setTextInputNativeID:(NSString *)textInputNativeID
{
  [[KeyboardOffsetProvider shared] removeOffsetForTextInputNativeID:_textInputNativeID withTag: self.reactTag];
  [[KeyboardOffsetProvider shared] setOffsetForTextInputNativeID:textInputNativeID offset:_offset withTag: self.reactTag];
  _textInputNativeID = textInputNativeID;
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> KeyboardGestureAreaCls(void)
{
  return KeyboardGestureArea.class;
}
#endif

@end
