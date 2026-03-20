//
//  NSObject+SafeKVC.m
//  KeyboardController
//
//  Created by Kiryl Ziusko on 26/10/2025.
//

#import "NSObject+SafeKVC.h"

@implementation NSObject (SafeKVC)
- (id)_safeValueForKey:(NSString *)key
{
  @try {
    return [self valueForKey:key];
  } @catch (NSException *exception) {
    return nil;
  }
}
@end
