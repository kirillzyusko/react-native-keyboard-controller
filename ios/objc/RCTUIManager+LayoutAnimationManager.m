//
//  RCTUIManager+LayoutAnimationManager.m
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 22/03/2024.
//

#import "RCTUIManager+LayoutAnimationManager.h"
#import <React/RCTLayoutAnimationGroup.h>

@implementation RCTUIManager (LayoutAnimationManager)

- (void)scheduleKeyboardAnimation {
    NSDictionary *animationConfig = @{
        @"duration": @250,
        @"update": @{
            @"duration": @250,
            @"type": @"keyboard"
        }
    };

    RCTLayoutAnimationGroup *layoutAnimationGroup = [[RCTLayoutAnimationGroup alloc] initWithConfig:animationConfig callback:^(NSArray *response) {
        // Handle the response here
        if (response.count > 0) {
            NSLog(@"Error setting up layout animation: %@", response[0]);
        }
    }];

    [self setNextLayoutAnimationGroup:layoutAnimationGroup];
}

-(void)unscheduleKeyboardAnimation {
    
}

@end
