//
//  OverKeyboardViewManager.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 17.09.24.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <React/RCTBridge.h>
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

@interface OverKeyboardViewManager : RCTViewManager
@end

@interface OverKeyboardView : UIView

- (instancetype)initWithFrame:(CGRect)frame bridge:(RCTBridge *)bridge;
@property (nonatomic, assign) BOOL visible;

@end