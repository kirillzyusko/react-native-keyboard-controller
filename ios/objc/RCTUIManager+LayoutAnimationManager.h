//
//  RCTUIManager+LayoutAnimationManager.h
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 22/03/2024.
//

#import <React/RCTUIManager.h>

@interface RCTUIManager (LayoutAnimationManager)

- (void)scheduleKeyboardAnimation;
- (void)unscheduleKeyboardAnimation;

@end
