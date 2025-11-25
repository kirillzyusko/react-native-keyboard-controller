#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE (KeyboardControllerViewManager, RCTViewManager)

// props
RCT_EXPORT_VIEW_PROPERTY(enabled, BOOL)

// callbacks
/// keyboard callbacks
RCT_EXPORT_VIEW_PROPERTY(onKeyboardMoveStart, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onKeyboardMove, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onKeyboardMoveEnd, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onKeyboardMoveInteractive, RCTDirectEventBlock);
/// input callbacks
RCT_EXPORT_VIEW_PROPERTY(onFocusedInputLayoutChanged, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onFocusedInputTextChanged, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onFocusedInputSelectionChanged, RCTDirectEventBlock);

// commands
RCT_EXTERN_METHOD(synchronizeFocusedInputLayout : (nonnull NSNumber *)reactTag);

@end
