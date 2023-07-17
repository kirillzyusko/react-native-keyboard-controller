//
//  KeyboardMoveEvent.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 6.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventDispatcherProtocol.h>

@interface KeyboardMoveEvent : NSObject <RCTEvent>

- (instancetype)initWithReactTag:(NSNumber *)reactTag
                           event:(NSString *)event
                          height:(NSNumber *)height
                        progress:(NSNumber *)progress
                        duration:(NSNumber *)duration
                          target:(NSNumber *)target;

@end
