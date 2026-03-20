//
//  UITextView+DelegateManager.m
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 24/04/2024.
//

#import <objc/runtime.h>
#import "UITextView+DelegateManager.h"

@implementation UITextView (DelegateManager)

/**
 * We are aware that delegate is set by RN on mount and we can not re-define it
 * but we are using composite delegate to forward all calls to original delegate
 * so we use this method to force set our delegate
 */
- (void)setForceDelegate:(id<UITextViewDelegate>)delegate
{
  Ivar ivar = class_getInstanceVariable([UITextView class], "_delegate");
  if (ivar) {
    object_setIvar(self, ivar, delegate);
  }
}

@end
