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

#import <react/renderer/components/RNKeyboardControllerViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNKeyboardControllerViewSpec/EventEmitters.h>
#import <react/renderer/components/RNKeyboardControllerViewSpec/Props.h>
#import <react/renderer/components/RNKeyboardControllerViewSpec/RCTComponentViewHelpers.h>

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
        initWithHandler:^(NSNumber *height, NSNumber *progress) {
          if (self->_eventEmitter) {
            std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(
                self->_eventEmitter)
                ->onKeyboardMove(
                    facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMove{
                        .height = [height intValue], .progress = static_cast<Float>(self.tag)});
          }

          // TODO: use built-in _eventEmitter once NativeAnimated module will use ModernEventemitter
          RCTBridge *bridge = [RCTBridge currentBridge];
          if (bridge) {
            KeyboardMoveEvent *keyboardMoveEvent =
                [[KeyboardMoveEvent alloc] initWithReactTag:@(self.tag)
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
