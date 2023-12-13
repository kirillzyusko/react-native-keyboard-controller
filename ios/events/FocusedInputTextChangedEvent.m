//
//  FocusedInputTextChangedEvent.m
//  KeyboardController
//
//  Created by Kiryl Ziusko on 27/11/2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#import "FocusedInputTextChangedEvent.h"
#import <React/RCTAssert.h>

@implementation FocusedInputTextChangedEvent {
  NSString *_text;
  uint16_t _coalescingKey;
}

- (NSString *)eventName
{
  return @"onFocusedInputTextChanged";
}

@synthesize viewTag = _viewTag;

- (instancetype)initWithReactTag:(NSNumber *)reactTag text:(NSString *)text
{
  RCTAssertParam(reactTag);

  if ((self = [super init])) {
    _viewTag = reactTag;
    _text = text;
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
    @"text" : _text,
  };

  return body;
}

- (BOOL)canCoalesce
{
  return NO;
}

- (FocusedInputTextChangedEvent *)coalesceWithEvent:(FocusedInputTextChangedEvent *)newEvent
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
