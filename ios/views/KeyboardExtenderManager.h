//
//  KeyboardExtenderManager.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 13.04.25.
//  Copyright © 2025 Facebook. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTBridge.h>
#endif
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

@interface KeyboardExtenderManager : RCTViewManager
@end

@interface KeyboardExtender :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

#endif
@property (nonatomic, assign) BOOL enabled;
@end
