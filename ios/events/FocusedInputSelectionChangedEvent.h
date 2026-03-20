//
//  FocusedInputSelectionChangedEvent.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 23/04/2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventDispatcherProtocol.h>

@interface FocusedInputSelectionChangedEvent : NSObject <RCTEvent>

- (instancetype)initWithReactTag:(NSNumber *)reactTag event:(NSObject *)event;

@end
