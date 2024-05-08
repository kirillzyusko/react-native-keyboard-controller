//
//  RCTTextView+DelegateManager.h
//  react-native-keyboard-controller
//
//  Created by Kiryl Ziusko on 24/04/2024.
//

#import <React/RCTUITextView.h>

@interface RCTUITextView (DelegateManager)

- (void)setForceDelegate:(id<UITextViewDelegate>)delegate;

@end
