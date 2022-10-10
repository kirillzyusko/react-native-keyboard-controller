//
//  KeyboardMoveEvent.m
//  KeyboardController
//
//  Created by Kiryl Ziusko on 6.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import "KeyboardMoveEvent.h"
#import <React/RCTAssert.h>

@implementation KeyboardMoveEvent {
  NSNumber *_progress;
  NSNumber *_height;
  uint16_t _coalescingKey;
}

@synthesize viewTag = _viewTag;
@synthesize eventName = _eventName;

- (instancetype)initWithReactTag:(NSNumber *)reactTag
                           event:(NSString *)event
                          height:(NSNumber *)height
                        progress:(NSNumber *)progress
{
  RCTAssertParam(reactTag);

  if ((self = [super init])) {
    _eventName = [event copy];
    _viewTag = reactTag;
    _progress = progress;
    _height = height;
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
    @"progress" : _progress,
    @"height" : _height,
  };

  return body;
}

- (BOOL)canCoalesce
{
  return NO;
}

- (KeyboardMoveEvent *)coalesceWithEvent:(KeyboardMoveEvent *)newEvent
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
