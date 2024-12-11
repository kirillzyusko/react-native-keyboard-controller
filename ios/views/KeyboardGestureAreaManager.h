//
//  KeyboardGestureAreaManager.h
//  Pods
//
//  Created by Kiryl Ziusko on 01/11/2024.
//

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTBridge.h>
#endif
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

@interface KeyboardGestureAreaManager : RCTViewManager
@end

@interface KeyboardGestureArea :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView

- (instancetype)initWithBridge:(RCTBridge *)bridge;

#endif
// TODO: should be array? How to specify multiple different offsets for different inputs?
@property (nonatomic, strong) NSNumber *offset;
@property (nonatomic, strong) NSString *textInputNativeID;
@end
