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

#import <react/renderer/components/RNKeyboardControllerViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNKeyboardControllerViewSpec/EventEmitters.h>
#import <react/renderer/components/RNKeyboardControllerViewSpec/Props.h>
#import <react/renderer/components/RNKeyboardControllerViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface KeyboardControllerView () <RCTKeyboardControllerViewViewProtocol>

@end

@implementation KeyboardControllerView {

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
      
    /*if (_eventEmitter) {
        std::dynamic_pointer_cast<const facebook::react::KeyboardControllerViewEventEmitter>(_eventEmitter)
            ->onKeyboardMove(facebook::react::KeyboardControllerViewEventEmitter::OnKeyboardMove{
              .height = 100,
              .progress = 1
            });
        }*/
  }

  return self;
}

Class<RCTComponentViewProtocol> KeyboardControllerViewCls(void)
{
  return KeyboardControllerView.class;
}

@end
#endif
