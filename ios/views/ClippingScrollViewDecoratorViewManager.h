//
//  ClippingScrollViewDecoratorViewManager.h
//  Pods
//
//  Created by Kiryl Ziusko on 03/03/2025.
//

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTView.h>
#endif
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

@interface ClippingScrollViewDecoratorViewManager : RCTViewManager
@end

@interface ClippingScrollViewDecoratorView :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView
#endif
@property (nonatomic, assign) BOOL applyWorkaroundForContentInsetHitTestBug;
@end
