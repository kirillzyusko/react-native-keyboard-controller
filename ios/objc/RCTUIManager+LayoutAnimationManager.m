//
//  RCTUIManager+LayoutAnimationManager.m
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 22/03/2024.
//

#import <React/RCTLayoutAnimationGroup.h>
#import "RCTUIManager+LayoutAnimationManager.h"

@implementation RCTUIManager (LayoutAnimationManager)

- (void)scheduleKeyboardAnimation
{
  NSDictionary *animationConfig =
      @{@"duration" : @250, @"update" : @{@"duration" : @250, @"type" : @"keyboard"}};

  RCTLayoutAnimationGroup *layoutAnimationGroup =
      [[RCTLayoutAnimationGroup alloc] initWithConfig:animationConfig callback:nil];

  [self setValue:layoutAnimationGroup forKey:@"_layoutAnimationGroup"];
}

- (void)unscheduleKeyboardAnimation
{
  RCTLayoutAnimationGroup *layoutAnimationGroup =
      [[RCTLayoutAnimationGroup alloc] initWithConfig:nil callback:nil];

  [self setValue:layoutAnimationGroup forKey:@"_layoutAnimationGroup"];
}

@end
