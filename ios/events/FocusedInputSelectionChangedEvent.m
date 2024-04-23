//
//  FocusedInputSelectionChangedEvent.m
//  KeyboardController
//
//  Created by Kiryl Ziusko on 23/04/2024.
//

#import "FocusedInputSelectionChangedEvent.h"
#import <React/RCTAssert.h>

@implementation FocusedInputSelectionChangedEvent {
  NSObject *_position;
  NSObject *_coordinates;
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
    
    _position = [event valueForKey:@"position"];
    _coordinates = [event valueForKey:@"coordinates"];
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
    @"position" : _position,
    @"coordinates" : _coordinates,
  };

  return body;
}

- (BOOL)canCoalesce
{
  return NO;
}

- (FocusedInputSelectionChangedEvent *)coalesceWithEvent:(FocusedInputSelectionChangedEvent *)newEvent
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
