//
//  FocusedInputTextChangedEvent.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 27/11/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventDispatcherProtocol.h>

@interface FocusedInputTextChangedEvent : NSObject <RCTEvent>

- (instancetype)initWithReactTag:(NSNumber *)reactTag text:(NSString *)text;

@end
