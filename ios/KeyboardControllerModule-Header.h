//
//  KeyboardControllerModule-Header.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 22.04.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

#ifdef __cplusplus
#import "react-native-keyboard-controller.h"
#endif

#import <React/RCTEventEmitter.h>

@interface KeyboardController : RCTEventEmitter
+ (KeyboardController *)shared;
- (void)sendEvent:(NSString *)name body:(id)body;
@end
