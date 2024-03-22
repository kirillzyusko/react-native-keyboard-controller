//
//  RCTUIManager+CustomMethod.h
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 22/03/2024.
//

/*#import "RCTUIManager.h"

@interface RCTUIManager (CustomMethod)

- (void)callMethodOnUIManager:(RCTUIManager *)uiManager;

@end*/

#import "RCTUIManager.h"

@interface RCTUIManager (LayoutAnimationManager)

- (void)scheduleKeyboardAnimation;

@end
