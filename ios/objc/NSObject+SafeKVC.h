//
//  NSObject+SafeKVC.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 26/10/2025.
//

#import <Foundation/Foundation.h>

@interface NSObject (SafeKVC)
- (id)_safeValueForKey:(NSString *)key;
@end
