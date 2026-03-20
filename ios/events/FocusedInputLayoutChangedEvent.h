//
//  FocusedInputLayoutChangedEvent.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 05/10/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventDispatcherProtocol.h>

@interface FocusedInputLayoutChangedEvent : NSObject <RCTEvent>

- (instancetype)initWithReactTag:(NSNumber *)reactTag event:(NSObject *)event;

@end
