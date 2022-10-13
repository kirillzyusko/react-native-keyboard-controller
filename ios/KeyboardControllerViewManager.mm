#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE (KeyboardControllerViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(onKeyboardMoveStart, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onKeyboardMove, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onKeyboardMoveEnd, RCTDirectEventBlock);

@end
