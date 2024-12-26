//
//  KeyboardToolbarExcludeViewManager.mm
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 26/12/2024.
//

#import "KeyboardToolbarExcludeViewManager.h"

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
@implementation KeyboardToolbarExcludeViewManager

RCT_EXPORT_MODULE(KeyboardToolbarExcludeViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifndef RCT_NEW_ARCH_ENABLED
- (UIView *)view
{
  return [[KeyboardToolbarExcludeView alloc] initWithBridge:self.bridge];
}
#endif

@end

// MARK: View
#ifdef RCT_NEW_ARCH_ENABLED
@interface KeyboardToolbarExcludeView () <RCTKeyboardToolbarExcludeViewViewProtocol>
@end
#endif

@implementation KeyboardToolbarExcludeView {}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<KeyboardToolbarExcludeViewComponentDescriptor>();
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
  self = [super init];
  return self;
}
#else
- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  self = [super init];
  return self;
}
#endif


#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> KeyboardToolbarExcludeViewCls(void)
{
  return KeyboardToolbarExcludeView.class;
}
#endif

@end
