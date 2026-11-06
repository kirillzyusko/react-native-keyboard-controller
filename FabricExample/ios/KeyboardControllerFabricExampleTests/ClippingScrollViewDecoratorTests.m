#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <objc/runtime.h>

// Exercise the decorator linked into the example without importing Fabric headers.
@interface UIView (ClippingScrollViewDecoratorTests)
@property (nonatomic, assign) BOOL applyWorkaroundForContentInsetHitTestBug;
- (void)prepareForRecycle;
@end

@interface KCRecordingScrollView : UIScrollView
@property (nonatomic, assign) NSUInteger scrollRectCalls;
@end

@implementation KCRecordingScrollView
- (void)scrollRectToVisible:(CGRect)rect animated:(BOOL)animated
{
  self.scrollRectCalls++;
}
@end

@interface KCScrollObserver : NSObject
@property (nonatomic, assign) NSUInteger notifications;
@end

@implementation KCScrollObserver
- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context
{
  self.notifications++;
}
@end

@interface ClippingScrollViewDecoratorTests : XCTestCase
@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) UIView *decorator;
@property (nonatomic, strong) UIView *container;
@property (nonatomic, strong) KCRecordingScrollView *scrollView;
@end

@implementation ClippingScrollViewDecoratorTests

- (void)setUp
{
  [super setUp];
  Class decoratorClass = NSClassFromString(@"ClippingScrollViewDecoratorView");
  XCTAssertNotNil(decoratorClass);
  self.window = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 320, 640)];
  self.decorator = [[decoratorClass alloc] initWithFrame:self.window.bounds];
  self.decorator.applyWorkaroundForContentInsetHitTestBug = YES;
  self.container = [[UIView alloc] initWithFrame:self.window.bounds];
  self.scrollView = [[KCRecordingScrollView alloc] initWithFrame:CGRectMake(0, 100, 320, 400)];
  self.scrollView.contentSize = CGSizeMake(320, 1200);
  [self.container addSubview:self.scrollView];
  [self.decorator addSubview:self.container];
  [self.window addSubview:self.decorator];
}

- (void)tearDown
{
  [self.decorator removeFromSuperview];
  self.decorator = nil;
  self.container = nil;
  self.scrollView = nil;
  self.window = nil;
  [super tearDown];
}

- (void)remount
{
  [self.decorator removeFromSuperview];
  [self.window addSubview:self.decorator];
}

- (NSUInteger)countClassesWithPrefix:(NSString *)prefix object:(id)object
{
  NSUInteger count = 0;
  for (Class cls = object_getClass(object); cls; cls = class_getSuperclass(cls)) {
    count += [NSStringFromClass(cls) hasPrefix:prefix];
  }
  return count;
}

- (void)testRemountIsIdempotentAndRecycleRestoresUnobservedClasses
{
  Class scrollClass = object_getClass(self.scrollView);
  Class containerClass = object_getClass(self.container);
  [self remount];
  [self remount];
  XCTAssertEqual(object_getClass(self.scrollView), scrollClass);
  XCTAssertEqual(object_getClass(self.container), containerClass);
  [self.scrollView scrollRectToVisible:CGRectZero animated:NO];
  XCTAssertEqual(self.scrollView.scrollRectCalls, 0u);
  XCTAssertEqual([self.container hitTest:CGPointMake(20, 20) withEvent:nil], self.scrollView);

  KCRecordingScrollView *sibling = [KCRecordingScrollView new];
  [sibling scrollRectToVisible:CGRectZero animated:NO];
  XCTAssertEqual(sibling.scrollRectCalls, 1u);

  [self.decorator prepareForRecycle];
  XCTAssertEqual(object_getClass(self.scrollView), KCRecordingScrollView.class);
  XCTAssertEqual(object_getClass(self.container), UIView.class);
  [self.scrollView scrollRectToVisible:CGRectZero animated:NO];
  XCTAssertEqual(self.scrollView.scrollRectCalls, 1u);
  XCTAssertEqual([self.container hitTest:CGPointMake(20, 20) withEvent:nil], self.container);
}

- (void)testRemountPreservesKVOScrollClassAndNotifications
{
  KCScrollObserver *observer = [KCScrollObserver new];
  [self.scrollView addObserver:observer forKeyPath:@"contentOffset" options:0 context:nil];
  Class observedClass = object_getClass(self.scrollView);
  XCTAssertTrue([NSStringFromClass(observedClass) hasPrefix:@"NSKVONotifying_"]);
  @try {
    [self remount];
    [self remount];
    XCTAssertEqual(object_getClass(self.scrollView), observedClass);
    XCTAssertEqual([self countClassesWithPrefix:@"KC_NoScrollRect_" object:self.scrollView], 1u);
    [self.scrollView scrollRectToVisible:CGRectZero animated:NO];
    XCTAssertEqual(self.scrollView.scrollRectCalls, 0u);
    NSUInteger notifications = observer.notifications;
    self.scrollView.contentOffset = CGPointMake(0, 20);
    XCTAssertEqual(observer.notifications, notifications + 1);

    [self.decorator prepareForRecycle];
    XCTAssertEqual(object_getClass(self.scrollView), observedClass);
    self.scrollView.contentOffset = CGPointMake(0, 40);
    XCTAssertEqual(observer.notifications, notifications + 2);
  } @finally {
    // Also keep observer teardown safe when running against the unfixed code.
    object_setClass(self.scrollView, observedClass);
    [self.scrollView removeObserver:observer forKeyPath:@"contentOffset"];
  }
  [self.decorator didMoveToWindow];
  [self.decorator prepareForRecycle];
  XCTAssertEqual(object_getClass(self.scrollView), KCRecordingScrollView.class);
}

- (void)testRemountPreservesKVOHitTestClassAndNotifications
{
  KCScrollObserver *observer = [KCScrollObserver new];
  [self.container addObserver:observer forKeyPath:@"tag" options:0 context:nil];
  Class observedClass = object_getClass(self.container);
  XCTAssertTrue([NSStringFromClass(observedClass) hasPrefix:@"NSKVONotifying_"]);
  @try {
    [self remount];
    [self remount];
    XCTAssertEqual(object_getClass(self.container), observedClass);
    XCTAssertEqual([self countClassesWithPrefix:@"KC_FixedHitTest_" object:self.container], 1u);
    XCTAssertEqual([self.container hitTest:CGPointMake(20, 20) withEvent:nil], self.scrollView);
    self.container.tag = 1;
    XCTAssertEqual(observer.notifications, 1u);

    [self.decorator prepareForRecycle];
    XCTAssertEqual(object_getClass(self.container), observedClass);
    self.container.tag = 2;
    XCTAssertEqual(observer.notifications, 2u);
  } @finally {
    object_setClass(self.container, observedClass);
    [self.container removeObserver:observer forKeyPath:@"tag"];
  }
  [self.decorator didMoveToWindow];
  [self.decorator prepareForRecycle];
  XCTAssertEqual(object_getClass(self.container), UIView.class);
}

- (void)testRemountPreservesOtherRuntimeSubclasses
{
  Class patchedClass = object_getClass(self.scrollView);
  NSString *name = [@"KCTest_Outer_" stringByAppendingString:NSUUID.UUID.UUIDString];
  Class outerClass = objc_allocateClassPair(patchedClass, name.UTF8String, 0);
  objc_registerClassPair(outerClass);
  object_setClass(self.scrollView, outerClass);
  [self remount];
  XCTAssertEqual(object_getClass(self.scrollView), outerClass);
  XCTAssertEqual([self countClassesWithPrefix:@"KC_NoScrollRect_" object:self.scrollView], 1u);
  object_setClass(self.scrollView, patchedClass);
}

@end
