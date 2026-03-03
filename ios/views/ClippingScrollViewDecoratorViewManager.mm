//
//  ClippingScrollViewDecoratorViewManager.mm
//  Pods
//
//  Created by Kiryl Ziusko on 03/03/2025.
//

#import "ClippingScrollViewDecoratorViewManager.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/RNKC/EventEmitters.h>
#import <react/renderer/components/RNKC/Props.h>
#import <react/renderer/components/RNKC/RCTComponentViewHelpers.h>
#import <react/renderer/components/RNKC/RNKCClippingScrollViewDecoratorViewComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"
#endif

#import <UIKit/UIKit.h>
#import <objc/runtime.h>

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;
#endif

#pragma mark - Helpers

static UIScrollView *KCFindFirstScrollView(UIView *view)
{
  for (UIView *subview in view.subviews) {
    if ([subview isKindOfClass:[UIScrollView class]] &&
        ![subview isKindOfClass:[UITextView class]]) {
      return (UIScrollView *)subview;
    }
    UIScrollView *found = KCFindFirstScrollView(subview);
    if (found) {
      return found;
    }
  }
  return nil;
}

static void KCApplyNoopScrollRectToVisible(UIScrollView *scrollView)
{
  if (!scrollView) {
    return;
  }

  Class originalClass = object_getClass(scrollView);
  NSString *originalClassName = NSStringFromClass(originalClass);

  // Already patched — nothing to do
  if ([originalClassName hasPrefix:@"KC_NoScrollRect_"]) {
    return;
  }

  NSString *subclassName = [@"KC_NoScrollRect_" stringByAppendingString:originalClassName];
  Class subclass = NSClassFromString(subclassName);

  if (!subclass) {
    subclass = objc_allocateClassPair(originalClass, subclassName.UTF8String, 0);
    if (!subclass) {
      return;
    }

    Method original =
        class_getInstanceMethod(originalClass, @selector(scrollRectToVisible:animated:));
    if (original) {
      IMP noopImp = imp_implementationWithBlock(
          ^(__unused UIScrollView *self, __unused CGRect rect, __unused BOOL animated){
              // no-op
          });
      class_addMethod(
          subclass,
          @selector(scrollRectToVisible:animated:),
          noopImp,
          method_getTypeEncoding(original));
    }

    objc_registerClassPair(subclass);
  }

  object_setClass(scrollView, subclass);
}

#pragma mark - Manager

@implementation ClippingScrollViewDecoratorViewManager

RCT_EXPORT_MODULE(ClippingScrollViewDecoratorViewManager)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifndef RCT_NEW_ARCH_ENABLED
- (UIView *)view
{
  return [[ClippingScrollViewDecoratorView alloc] init];
}
#endif

@end

#pragma mark - View

#ifdef RCT_NEW_ARCH_ENABLED
@interface ClippingScrollViewDecoratorView () <RCTClippingScrollViewDecoratorViewViewProtocol>
#else
@interface ClippingScrollViewDecoratorView ()
#endif
@end

@implementation ClippingScrollViewDecoratorView

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<ClippingScrollViewDecoratorViewComponentDescriptor>();
}
#endif

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  if (self.window) {
    UIScrollView *scrollView = KCFindFirstScrollView(self);
    KCApplyNoopScrollRectToVisible(scrollView);
  }
}

#ifdef RCT_NEW_ARCH_ENABLE
Class<RCTComponentViewProtocol> ClippingScrollViewDecoratorViewCls(void)
{
  return ClippingScrollViewDecoratorView.class;
}
#endif

@end
