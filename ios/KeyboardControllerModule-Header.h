//
//  KeyboardControllerModule-Header.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 22.04.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <React/RCTEventEmitter.h>

@interface KeyboardController : RCTEventEmitter
+ (KeyboardController *)shared;
- (void)sendEvent:(NSString *)name body:(id)body;
@end
