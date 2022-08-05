//
//  KeyboardMovementObserver.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 3.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^OnEventBlock)(int height, float progress);
typedef void (^OnNotifyBlock)(NSString* event, NSDictionary* data);

@interface KeyboardMovementObserver : NSObject
- (KeyboardMovementObserver*)initWithHandler:OnEventBlock onNotify:OnNotifyBlock;
- (void)mount;
- (void)unmount;
@end

NS_ASSUME_NONNULL_END
