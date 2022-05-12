#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(KeyboardControllerViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(onKeyboardMove, RCTDirectEventBlock);

@end
