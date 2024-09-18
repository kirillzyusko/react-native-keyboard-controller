//
//  OverKeyboardViewManager.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 17.09.24.
//  Copyright © 2024 Facebook. All rights reserved.
//
#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTBridge.h>
#endif
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

@interface OverKeyboardViewManager : RCTViewManager
@end

@interface OverKeyboardView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

#endif
@property (nonatomic, assign) BOOL visible;
@end
