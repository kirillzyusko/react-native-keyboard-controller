//
//  KeyboardControllerView.mm
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

// This guard prevent the code from being compiled in the old architecture
#ifdef RCT_NEW_ARCH_ENABLED
#include <functional>
#include <map>
#include <string>

#import "KeyboardControllerView.h"
#import "FocusedInputLayoutChangedEvent.h"
#import "FocusedInputSelectionChangedEvent.h"
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

// Helper function to set common fields
template <typename EventStruct>
void setCommonFields(EventStruct &eventStruct, NSNumber *height, NSNumber *progress, NSNumber *duration, NSNumber *target) {
    eventStruct.height = [height doubleValue];
    eventStruct.progress = [progress doubleValue];
    eventStruct.duration = [duration intValue];
    eventStruct.target = [target intValue];
}

// Define a type for the method pointer
template <typename EventStruct>
using EventMethod = void (facebook::react::KeyboardControllerViewEventEmitter::*)(const EventStruct&) const;

// Create a map from event strings to their corresponding method and a lambda to set the struct values
std::map<std::string, std::function<void(facebook::react::KeyboardControllerViewEventEmitter const*,
                                          NSNumber*, NSNumber*, NSNumber*, NSNumber*)>> eventMap = {
    {"onKeyboardMoveStart", [](const facebook::react::KeyboardControllerViewEventEmitter* emitter, NSNumber* height, NSNumber* progress, NSNumber* duration, NSNumber* target) {
        facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMoveStart eventStruct;
        setCommonFields(eventStruct, height, progress, duration, target);
        (emitter->*(&facebook::react::KeyboardControllerViewEventEmitter::onKeyboardMoveStart))(eventStruct);
    }},
    {"onKeyboardMove", [](const facebook::react::KeyboardControllerViewEventEmitter* emitter, NSNumber* height, NSNumber* progress, NSNumber* duration, NSNumber* target) {
        facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMove eventStruct;
        setCommonFields(eventStruct, height, progress, duration, target);
        (emitter->*(&facebook::react::KeyboardControllerViewEventEmitter::onKeyboardMove))(eventStruct);
    }},
    {"onKeyboardMoveEnd", [](const facebook::react::KeyboardControllerViewEventEmitter* emitter, NSNumber* height, NSNumber* progress, NSNumber* duration, NSNumber* target) {
        facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMoveEnd eventStruct;
        setCommonFields(eventStruct, height, progress, duration, target);
        (emitter->*(&facebook::react::KeyboardControllerViewEventEmitter::onKeyboardMoveEnd))(eventStruct);
    }},
    {"onKeyboardMoveInteractive", [](const facebook::react::KeyboardControllerViewEventEmitter* emitter, NSNumber* height, NSNumber* progress, NSNumber* duration, NSNumber* target) {
        facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMoveInteractive eventStruct;
        setCommonFields(eventStruct, height, progress, duration, target);
        (emitter->*(&facebook::react::KeyboardControllerViewEventEmitter::onKeyboardMoveInteractive))(eventStruct);
    }}
};

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
            double absoluteX = [event[@"layout"][@"absoluteX"] doubleValue];
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
                                    .absoluteX = absoluteX,
                                    .height = height,
                                    .width = width,
                                    .x = x,
                                    .y = y}});
            // TODO: use built-in _eventEmitter once NativeAnimated module will use
            // ModernEventEmitter
            RCTBridge *bridge = [RCTBridge currentBridge];
            if (bridge) {
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
            // ModernEventEmitter
            RCTBridge *bridge = [RCTBridge currentBridge];
            if (bridge) {
              FocusedInputTextChangedEvent *textChangedEvent =
                  [[FocusedInputTextChangedEvent alloc] initWithReactTag:@(self.tag) text:text];
              [bridge.eventDispatcher sendEvent:textChangedEvent];
            }
          }
        }
        onSelectionChangedHandler:^(NSDictionary *event) {
          if (self->_eventEmitter) {
            int target = [event[@"target"] integerValue];
            double startX = [event[@"selection"][@"start"][@"x"] doubleValue];
            double startY = [event[@"selection"][@"start"][@"y"] doubleValue];
            double endX = [event[@"selection"][@"end"][@"x"] doubleValue];
            double endY = [event[@"selection"][@"end"][@"y"] doubleValue];
            int start = [event[@"selection"][@"start"][@"position"] integerValue];
            int end = [event[@"selection"][@"end"][@"position"] integerValue];

            std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                self->_eventEmitter)
                ->onFocusedInputSelectionChanged(
                    facebook::react::KeyboardControllerViewEventEmitter::
                        OnFocusedInputSelectionChanged{
                            .target = target,
                            .selection = facebook::react::KeyboardControllerViewEventEmitter::
                                OnFocusedInputSelectionChangedSelection{
                                    .start =
                                        facebook::react::KeyboardControllerViewEventEmitter::
                                            OnFocusedInputSelectionChangedSelectionStart{
                                                .x = startX, .y = startY, .position = start},
                                    .end = facebook::react::KeyboardControllerViewEventEmitter::
                                        OnFocusedInputSelectionChangedSelectionEnd{
                                            .x = endX, .y = endY, .position = end}}});
            // TODO: use built-in _eventEmitter once NativeAnimated module will use
            // ModernEventEmitter
            RCTBridge *bridge = [RCTBridge currentBridge];
            if (bridge) {
              FocusedInputSelectionChangedEvent *selectionChangedEvent =
                  [[FocusedInputSelectionChangedEvent alloc] initWithReactTag:@(self.tag)
                                                                        event:event];
              [bridge.eventDispatcher sendEvent:selectionChangedEvent];
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
                    // Check if the event exists in the map and call the corresponding method
                    auto it = eventMap.find([event UTF8String]);
                    if (it != eventMap.end()) {
                        const auto& handler = it->second;
                        handler(std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(self->_eventEmitter).get(), height, progress, duration, target);
                    }
                }

          // TODO: use built-in _eventEmitter once NativeAnimated module will use ModernEventEmitter
          RCTBridge *bridge = [RCTBridge currentBridge];
          if (bridge) {
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
