#pragma once

#if SWIFT_PACKAGE
// SwiftPM does not expose a static Swift target's generated header to Objective-C++.
// Declare only the @objc API consumed here, using explicit Objective-C runtime names.
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface FocusedInputObserver : NSObject
- (instancetype)initOnLayoutChangedHandler:(void (^)(NSDictionary *))onLayoutChangedHandler
                      onTextChangedHandler:(void (^)(NSString *))onTextChangedHandler
                 onSelectionChangedHandler:(void (^)(NSDictionary *))onSelectionChangedHandler
                             onFocusDidSet:(void (^)(NSDictionary *))onFocusDidSet;
- (void)mount;
- (void)unmount;
- (void)syncUpLayout;
@end

@interface KeyboardTrackingView : UIView
- (void)attachToTopmostViewToWindow:(nullable UIWindow *)window;
@end

@interface KeyboardMovementObserver : NSObject
@property (nonatomic, strong) KeyboardTrackingView *keyboardTrackingView;
- (instancetype)initWithHandler:
                    (void (^)(NSString *, NSNumber *, NSNumber *, NSNumber *, NSNumber *))handler
                       onNotify:(void (^)(NSString *, id))onNotify
             onRequestAnimation:(void (^)(void))onRequestAnimation
              onCancelAnimation:(void (^)(void))onCancelAnimation;
- (void)mount;
- (void)unmount;
@end

@interface KeyboardControllerModuleImpl : NSObject
+ (void)setTranslucent:(BOOL)translucent;
+ (void)dismiss:(BOOL)keepFocus animated:(BOOL)animated;
@end

@interface KeyboardExtenderContainerView : NSObject
+ (CGFloat)keyboardBorderRadius;
+ (UIView *)createWithFrame:(CGRect)frame contentView:(UIView *)contentView;
@end

@interface KeyboardOffsetProvider : NSObject
+ (instancetype)shared;
- (void)setOffsetForTextInputNativeID:(NSString *)nativeID
                               offset:(NSNumber *)offset
                              withTag:(NSNumber *)tag;
- (void)removeOffsetForTextInputNativeID:(NSString *)nativeID withTag:(NSNumber *)tag;
@end

@interface ViewHierarchyNavigator : NSObject
+ (void)setFocusToDirection:(NSString *)direction;
@end

@interface UIUtils : NSObject
@property (class, nonatomic, readonly) double nextFrame;
@end

@interface UIApplication (KeyboardControllerSwift)
@property (nonatomic, readonly, nullable) UIWindow *activeWindow;
@end

@interface UIResponder (KeyboardControllerSwift)
+ (nullable UIResponder *)current;
+ (void)preloadKeyboardIfNeeded;
+ (void)swizzleBecomeFirstResponder;
+ (void)swizzleResignFirstResponder;
@end

@interface UIView (KeyboardControllerSwift)
@property (nonatomic, readonly) NSNumber *reactNativeTag;
@end

@interface UIWindow (KeyboardControllerSwift)
+ (id)sharedKeyboardWindowObserver;
+ (nullable UIWindow *)topWindow;
@end

NS_ASSUME_NONNULL_END
#endif
