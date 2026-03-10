//
//  KeyboardToolbarGroupViewManager.mm
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 26/12/2024.
//

#import "KeyboardToolbarGroupViewManager.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/RNKC/EventEmitters.h>
#import <react/renderer/components/RNKC/Props.h>
#import <react/renderer/components/RNKC/RCTComponentViewHelpers.h>
#import <react/renderer/components/RNKC/RNKCKeyboardToolbarGroupViewComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#endif

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

// MARK: Manager
@implementation KeyboardToolbarGroupViewManager

RCT_EXPORT_MODULE(KeyboardToolbarGroupViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifndef RCT_NEW_ARCH_ENABLED
- (UIView *)view
{
  return [[KeyboardToolbarGroupView alloc] initWithBridge:self.bridge];
}
#endif

@end

// MARK: View
#ifdef RCT_NEW_ARCH_ENABLED
@interface KeyboardToolbarGroupView () <RCTKeyboardToolbarGroupViewViewProtocol>
@end
#endif

@implementation KeyboardToolbarGroupView {
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<KeyboardToolbarGroupViewComponentDescriptor>();
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
Class<RCTComponentViewProtocol> KeyboardToolbarGroupViewCls(void)
{
  return KeyboardToolbarGroupView.class;
}
#endif

@end
