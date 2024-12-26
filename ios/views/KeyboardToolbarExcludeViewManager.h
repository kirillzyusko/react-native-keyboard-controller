//
//  KeyboardToolbarExcludeViewManager.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 26/12/2024.
//

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTBridge.h>
#endif
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

@interface KeyboardToolbarExcludeViewManager : RCTViewManager
@end

@interface KeyboardToolbarExcludeView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

#endif
@end
