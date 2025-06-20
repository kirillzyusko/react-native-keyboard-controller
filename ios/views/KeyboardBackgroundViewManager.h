//
//  KeyboardBackgroundViewManager.h
//  Pods
//
//  Created by Kiryl Ziusko on 21/04/2025.
//

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTBridge.h>
#endif
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

@interface KeyboardBackgroundViewManager : RCTViewManager
@end

@interface KeyboardBackgroundView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

#endif

@end
