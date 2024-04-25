//
//  FocusedInputSelectionChangedEvent.m
//  KeyboardController
//
//  Created by Kiryl Ziusko on 23/04/2024.
//

#import "FocusedInputSelectionChangedEvent.h"
#import <React/RCTAssert.h>

@implementation FocusedInputSelectionChangedEvent {
  NSNumber *_target;
  NSObject *_selection;
  uint16_t _coalescingKey;
}

- (NSString *)eventName
{
  return @"onFocusedInputSelectionChanged";
}

@synthesize viewTag = _viewTag;

- (instancetype)initWithReactTag:(NSNumber *)reactTag event:(NSObject *)event
{
  RCTAssertParam(reactTag);

  if ((self = [super init])) {
    _viewTag = reactTag;

    _selection = [event valueForKey:@"selection"];
    _target = [event valueForKey:@"target"];
    _coalescingKey = 0;
  }
  return self;
}

RCT_NOT_IMPLEMENTED(-(instancetype)init)

- (uint16_t)coalescingKey
{
  return _coalescingKey;
}

- (NSDictionary *)body
{
  NSDictionary *body = @{
    @"selection" : _selection,
    @"target" : _target,
  };

  return body;
}

- (BOOL)canCoalesce
{
  return NO;
}

- (FocusedInputSelectionChangedEvent *)coalesceWithEvent:
    (FocusedInputSelectionChangedEvent *)newEvent
{
  return newEvent;
}

+ (NSString *)moduleDotMethod
{
  return @"RCTEventEmitter.receiveEvent";
}

- (NSArray *)arguments
{
  return @[ self.viewTag, RCTNormalizeInputEventName(self.eventName), [self body] ];
}

@end
