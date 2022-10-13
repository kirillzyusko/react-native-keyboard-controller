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
#import "KeyboardMoveEvent.h"
#import "react_native_keyboard_controller-Swift.h"

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
  KeyboardMovementObserver *observer;
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

    observer = [[KeyboardMovementObserver alloc]
        initWithHandler:^(NSString *event, NSNumber *height, NSNumber *progress) {
          if (self->_eventEmitter) {
            // TODO: use reflection to reduce code duplication?
            if ([event isEqualToString:@"onKeyboardMoveStart"]) {
              std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                  self->_eventEmitter)
                  ->onKeyboardMoveStart(
                      facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMoveStart{
                          .height = [height intValue], .progress = [progress floatValue]});
            }
            if ([event isEqualToString:@"onKeyboardMove"]) {
              std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                  self->_eventEmitter)
                  ->onKeyboardMove(
                      facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMove{
                          .height = [height intValue], .progress = [progress floatValue]});
            }
            if ([event isEqualToString:@"onKeyboardMoveEnd"]) {
              std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                  self->_eventEmitter)
                  ->onKeyboardMoveEnd(
                      facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMoveEnd{
                          .height = [height intValue], .progress = [progress floatValue]});
            }
          }

          // TODO: use built-in _eventEmitter once NativeAnimated module will use ModernEventemitter
          RCTBridge *bridge = [RCTBridge currentBridge];
          if (bridge) {
            KeyboardMoveEvent *keyboardMoveEvent =
                [[KeyboardMoveEvent alloc] initWithReactTag:@(self.tag)
                                                      event:event
                                                     height:height
                                                   progress:progress];
            [bridge.eventDispatcher sendEvent:keyboardMoveEvent];
          }
        }
        onNotify:^(NSString *event, NSDictionary *data) {
          [KeyboardController.shared sendEvent:event body:data];
        }];
    [observer mount];
  }

  return self;
}

Class<RCTComponentViewProtocol> KeyboardControllerViewCls(void)
{
  return KeyboardControllerView.class;
}

@end
#endif
