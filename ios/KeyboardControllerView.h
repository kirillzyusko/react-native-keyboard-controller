//
//  KeyboardControllerView.h
//  KeyboardController
//
//  Created by Kiryl Ziusko on 2.08.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

#pragma once

// This guard prevent this file to be compiled in the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface KeyboardControllerView : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#endif /* RCT_NEW_ARCH_ENABLED */
