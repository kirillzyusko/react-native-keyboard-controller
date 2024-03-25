//
//  KeyboardControllerView.mm
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

// This guard prevent the code from being compiled in the old architecture
#ifdef RCT_NEW_ARCH_ENABLED
#import "KeyboardControllerView.h"
#import "FocusedInputLayoutChangedEvent.h"
#import "FocusedInputTextChangedEvent.h"
#import "KeyboardMoveEvent.h"

#if __has_include("react_native_keyboard_controller-Swift.h")
#import "react_native_keyboard_controller-Swift.h"
#else
#import <react_native_keyboard_controller/react_native_keyboard_controller-Swift.h>
#endif

#import <react/renderer/components/reactnativekeyboardcontroller/ComponentDescriptors.h>
#import <react/renderer/components/reactnativekeyboardcontroller/EventEmitters.h>
#import <react/renderer/components/reactnativekeyboardcontroller/Props.h>
#import <react/renderer/components/reactnativekeyboardcontroller/RCTComponentViewHelpers.h>

#import <React/RCTBridge+Private.h>

#import "KeyboardControllerModule-Header.h"
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface KeyboardControllerView () <RCTKeyboardControllerViewViewProtocol>

@end

@implementation KeyboardControllerView {
  KeyboardMovementObserver *keyboardObserver;
  FocusedInputObserver *inputObserver;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<KeyboardControllerViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const KeyboardControllerViewProps>();
    _props = defaultProps;

    inputObserver = [[FocusedInputObserver alloc]
        initOnLayoutChangedHandler:^(NSDictionary *event) {
          if (self->_eventEmitter) {
            int target = [event[@"target"] integerValue];
            int parentScrollViewTarget = [event[@"parentScrollViewTarget"] integerValue];
            double absoluteY = [event[@"layout"][@"absoluteY"] doubleValue];
            double absoulteX = [event[@"layout"][@"absoluteX"] doubleValue];
            double y = [event[@"layout"][@"y"] doubleValue];
            double x = [event[@"layout"][@"x"] doubleValue];
            double width = [event[@"layout"][@"width"] doubleValue];
            double height = [event[@"layout"][@"height"] doubleValue];

            std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                self->_eventEmitter)
                ->onFocusedInputLayoutChanged(
                    facebook::react::KeyboardControllerViewEventEmitter::
                        OnFocusedInputLayoutChanged{
                            .target = target,
                            .parentScrollViewTarget = parentScrollViewTarget,
                            .layout = facebook::react::KeyboardControllerViewEventEmitter::
                                OnFocusedInputLayoutChangedLayout{
                                    .absoluteY = absoluteY,
                                    .absoluteX = absoulteX,
                                    .height = height,
                                    .width = width,
                                    .x = x,
                                    .y = y}});
            // TODO: use built-in _eventEmitter once NativeAnimated module will use
            // ModernEventemitter
            RCTBridge *bridge = [RCTBridge currentBridge];
            if (bridge && [bridge valueForKey:@"_jsThread"]) {
              FocusedInputLayoutChangedEvent *inputChangedEvent =
                  [[FocusedInputLayoutChangedEvent alloc] initWithReactTag:@(self.tag) event:event];
              [bridge.eventDispatcher sendEvent:inputChangedEvent];
            }
          }
        }
        onTextChangedHandler:^(NSString *text) {
          if (self->_eventEmitter) {
            std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                self->_eventEmitter)
                ->onFocusedInputTextChanged(
                    facebook::react::KeyboardControllerViewEventEmitter::OnFocusedInputTextChanged{
                        .text = std::string([text UTF8String])});

            // TODO: use built-in _eventEmitter once NativeAnimated module will use
            // ModernEventemitter
            RCTBridge *bridge = [RCTBridge currentBridge];
            if (bridge && [bridge valueForKey:@"_jsThread"]) {
              FocusedInputTextChangedEvent *textChangedEvent =
                  [[FocusedInputTextChangedEvent alloc] initWithReactTag:@(self.tag) text:text];
              [bridge.eventDispatcher sendEvent:textChangedEvent];
            }
          }
        }
        onFocusDidSet:^(NSDictionary *data) {
          [KeyboardController.shared sendEvent:@"KeyboardController::focusDidSet" body:data];
        }];
    keyboardObserver = [[KeyboardMovementObserver alloc]
        initWithHandler:^(
            NSString *event,
            NSNumber *height,
            NSNumber *progress,
            NSNumber *duration,
            NSNumber *target) {
          if (self->_eventEmitter) {
            // TODO: use reflection to reduce code duplication?
            if ([event isEqualToString:@"onKeyboardMoveStart"]) {
              std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                  self->_eventEmitter)
                  ->onKeyboardMoveStart(
                      facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMoveStart{
                          .height = [height doubleValue],
                          .progress = [progress doubleValue],
                          .duration = [duration intValue],
                          .target = [target intValue]});
            }
            if ([event isEqualToString:@"onKeyboardMove"]) {
              std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                  self->_eventEmitter)
                  ->onKeyboardMove(
                      facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMove{
                          .height = [height doubleValue],
                          .progress = [progress doubleValue],
                          .duration = [duration intValue],
                          .target = [target intValue]});
            }
            if ([event isEqualToString:@"onKeyboardMoveEnd"]) {
              std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                  self->_eventEmitter)
                  ->onKeyboardMoveEnd(
                      facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMoveEnd{
                          .height = [height doubleValue],
                          .progress = [progress doubleValue],
                          .duration = [duration intValue],
                          .target = [target intValue]});
            }
          }
          if ([event isEqualToString:@"onKeyboardMoveInteractive"]) {
            std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                self->_eventEmitter)
                ->onKeyboardMoveInteractive(
                    facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMoveInteractive{
                        .height = [height doubleValue],
                        .progress = [progress doubleValue],
                        .duration = [duration intValue],
                        .target = [target intValue]});
          }

          // TODO: use built-in _eventEmitter once NativeAnimated module will use ModernEventemitter
          RCTBridge *bridge = [RCTBridge currentBridge];
          if (bridge && [bridge valueForKey:@"_jsThread"]) {
            KeyboardMoveEvent *keyboardMoveEvent =
                [[KeyboardMoveEvent alloc] initWithReactTag:@(self.tag)
                                                      event:event
                                                     height:height
                                                   progress:progress
                                                   duration:duration
                                                     target:target];
            [bridge.eventDispatcher sendEvent:keyboardMoveEvent];
          }
        }
        onNotify:^(NSString *event, NSDictionary *data) {
          [KeyboardController.shared sendEvent:event body:data];
        }
        onRequestAnimation:^() {
          // no-op for fabric
        }
        onCancelAnimation:^(){
            // no-op for fabric
        }];
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<const KeyboardControllerViewProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const KeyboardControllerViewProps>(props);

  if (newViewProps.enabled != oldViewProps.enabled) {
    if (newViewProps.enabled) {
      [self mount];
    } else {
      [self unmount];
    }
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)willMoveToSuperview:(UIView *)newSuperview
{
  if (newSuperview == nil) {
    [self unmount];
  } else {
    [self mount];
  }
}

- (void)mount
{
  [inputObserver mount];
  [keyboardObserver mount];
}

- (void)unmount
{
  [inputObserver unmount];
  [keyboardObserver unmount];
}

Class<RCTComponentViewProtocol> KeyboardControllerViewCls(void)
{
  return KeyboardControllerView.class;
}

@end
#endif
