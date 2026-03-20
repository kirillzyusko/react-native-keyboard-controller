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

// Workaround for https://github.com/facebook/react-native/issues/54123
// RN 0.81+ ScrollView contentInset area doesn't respond to touch events.
// Can be removed once the upstream fix lands.
static void KCApplyFixedHitTest(UIScrollView *scrollView)
{
  if (!scrollView || !scrollView.superview) {
    return;
  }

  UIView *container = scrollView.superview;
  Class originalClass = object_getClass(container);
  NSString *originalClassName = NSStringFromClass(originalClass);

  // Already patched — nothing to do
  if ([originalClassName hasPrefix:@"KC_FixedHitTest_"]) {
    return;
  }

  NSString *subclassName = [@"KC_FixedHitTest_" stringByAppendingString:originalClassName];
  Class subclass = NSClassFromString(subclassName);

  if (!subclass) {
    subclass = objc_allocateClassPair(originalClass, subclassName.UTF8String, 0);
    if (!subclass) {
      return;
    }

    Method original = class_getInstanceMethod(originalClass, @selector(hitTest:withEvent:));
    if (original) {
      // Get the original implementation to call it
      IMP originalImp = method_getImplementation(original);
      UIView *(*originalHitTest)(id, SEL, CGPoint, UIEvent *) =
          (UIView * (*)(id, SEL, CGPoint, UIEvent *)) originalImp;

      IMP fixedHitTestImp = imp_implementationWithBlock(
          ^UIView *(__unsafe_unretained UIView *self, CGPoint point, UIEvent *event) {
            // Call the original implementation
            UIView *result = originalHitTest(self, @selector(hitTest:withEvent:), point, event);

            // This is the fix: when RN's betterHitTest returns self (the container),
            // return the scrollView instead so touches can reach it
            if (result == self) {
              // Dynamically find the scrollView at hit-test time to handle RN refreshes
              // where the scrollView instance is recreated but the swizzled class persists
              for (UIView *subview in self.subviews) {
                if ([subview isKindOfClass:[UIScrollView class]] &&
                    ![subview isKindOfClass:[UITextView class]]) {
                  return subview;
                }
              }
            }

            return result;
          });

      class_addMethod(
          subclass,
          @selector(hitTest:withEvent:),
          fixedHitTestImp,
          method_getTypeEncoding(original));
    }

    objc_registerClassPair(subclass);
  }

  object_setClass(container, subclass);
}

#pragma mark - Manager

@implementation ClippingScrollViewDecoratorViewManager

RCT_EXPORT_MODULE(ClippingScrollViewDecoratorViewManager)

RCT_EXPORT_VIEW_PROPERTY(applyWorkaroundForContentInsetHitTestBug, BOOL)

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

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &newViewProps =
      *std::static_pointer_cast<const ClippingScrollViewDecoratorViewProps>(props);

  self.applyWorkaroundForContentInsetHitTestBug =
      newViewProps.applyWorkaroundForContentInsetHitTestBug;

  [super updateProps:props oldProps:oldProps];
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
    if (self.applyWorkaroundForContentInsetHitTestBug) {
      KCApplyFixedHitTest(scrollView);
    }
  }
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> ClippingScrollViewDecoratorViewCls(void)
{
  return ClippingScrollViewDecoratorView.class;
}
#endif

@end
