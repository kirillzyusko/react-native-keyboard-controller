//
//  CustomKeyboardViewManager.h
//  KeyboardController
//
//  Created by Vladyslav Martynov on 11/07/2026.
//
#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTBridge.h>
#endif
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

@interface CustomKeyboardViewManager : RCTViewManager
@end

@interface CustomKeyboardView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

#endif
@property (nonatomic, assign) BOOL enabled;
@end
