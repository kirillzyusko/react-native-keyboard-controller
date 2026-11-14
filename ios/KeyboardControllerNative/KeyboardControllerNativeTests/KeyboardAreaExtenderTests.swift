import UIKit
import XCTest

final class KeyboardAreaExtenderTests: XCTestCase {
  private var window: UIWindow!
  private var previousWindow: UIWindow?
  private var controller: UIViewController!
  private var input: UITextField!
  private let nativeID = "dismiss-padding-input"
  private let tag: NSNumber = 42

  override func setUpWithError() throws {
    try super.setUpWithError()
    guard #available(iOS 26.0, *) else {
      throw XCTSkip("Native dismissal padding is used on iOS 26 and later.")
    }
    let scene = try XCTUnwrap(UIApplication.shared.connectedScenes.first as? UIWindowScene)
    previousWindow = UIApplication.shared.activeWindow
    controller = UIViewController()
    window = UIWindow(windowScene: scene)
    window.rootViewController = controller
    window.makeKeyAndVisible()
    controller.view.keyboardLayoutGuide.keyboardDismissPadding = 12

    let container = UIView(frame: CGRect(x: 0, y: 100, width: 300, height: 44))
    container.accessibilityIdentifier = nativeID
    input = UITextField(frame: container.bounds)
    container.addSubview(input)
    controller.view.addSubview(container)
    KeyboardOffsetProvider.shared.setOffset(forTextInputNativeID: nativeID, offset: 73, withTag: tag)
    XCTAssertTrue(input.becomeFirstResponder())
  }

  override func tearDownWithError() throws {
    input?.resignFirstResponder()
    KeyboardAreaExtender.shared.remove()
    KeyboardOffsetProvider.shared.removeOffset(forTextInputNativeID: nativeID, withTag: tag)
    window?.isHidden = true
    previousWindow?.makeKey()
    window = nil
    controller = nil
    input = nil
    try super.tearDownWithError()
  }

  func testExtendsDismissalWithoutChangingKeyboardHeight() {
    NotificationCenter.default.post(name: .keyboardDidAppear, object: nil)

    XCTAssertNil(input.inputAccessoryView)
    XCTAssertEqual(KeyboardAreaExtender.shared.offset, 0)
    XCTAssertEqual(controller.view.keyboardLayoutGuide.keyboardDismissPadding, 73)

    KeyboardOffsetProvider.shared.setOffset(forTextInputNativeID: nativeID, offset: 129.5, withTag: tag)

    XCTAssertEqual(controller.view.keyboardLayoutGuide.keyboardDismissPadding, 129.5)
    XCTAssertEqual(KeyboardAreaExtender.shared.offset, 0)
  }

  func testRemovingTheActiveRegistrationRestoresPreviousPadding() {
    NotificationCenter.default.post(name: .keyboardDidAppear, object: nil)
    KeyboardOffsetProvider.shared.removeOffset(forTextInputNativeID: nativeID, withTag: 99)

    XCTAssertEqual(controller.view.keyboardLayoutGuide.keyboardDismissPadding, 73)

    KeyboardOffsetProvider.shared.removeOffset(forTextInputNativeID: nativeID, withTag: tag)

    XCTAssertEqual(controller.view.keyboardLayoutGuide.keyboardDismissPadding, 12)
  }

  func testHidingTheKeyboardRestoresPreviousPadding() {
    NotificationCenter.default.post(name: .keyboardDidAppear, object: nil)
    NotificationCenter.default.post(name: UIResponder.keyboardDidHideNotification, object: nil)

    XCTAssertEqual(controller.view.keyboardLayoutGuide.keyboardDismissPadding, 12)
  }

  func testReregisteringWhileFocusedAppliesPaddingWithoutAnotherKeyboardEvent() {
    NotificationCenter.default.post(name: .keyboardDidAppear, object: nil)
    KeyboardOffsetProvider.shared.removeOffset(forTextInputNativeID: nativeID, withTag: tag)
    KeyboardOffsetProvider.shared.setOffset(forTextInputNativeID: nativeID, offset: 61, withTag: tag)

    XCTAssertEqual(controller.view.keyboardLayoutGuide.keyboardDismissPadding, 61)
    XCTAssertNil(input.inputAccessoryView)
  }

  func testFocusingAnUnregisteredInputRestoresPreviousPadding() {
    NotificationCenter.default.post(name: .keyboardDidAppear, object: nil)
    let otherInput = UITextField(frame: CGRect(x: 0, y: 200, width: 300, height: 44))
    controller.view.addSubview(otherInput)
    XCTAssertTrue(otherInput.becomeFirstResponder())

    XCTAssertEqual(controller.view.keyboardLayoutGuide.keyboardDismissPadding, 12)
    XCTAssertNil(otherInput.inputAccessoryView)
  }

  func testSwitchingRegisteredInputsAppliesTheNewOffsetOnFocus() {
    NotificationCenter.default.post(name: .keyboardDidAppear, object: nil)
    let otherNativeID = "other-dismiss-padding-input"
    let otherTag: NSNumber = 43
    let container = UIView(frame: CGRect(x: 0, y: 200, width: 300, height: 44))
    container.accessibilityIdentifier = otherNativeID
    let otherInput = UITextField(frame: container.bounds)
    container.addSubview(otherInput)
    controller.view.addSubview(container)
    KeyboardOffsetProvider.shared.setOffset(forTextInputNativeID: otherNativeID, offset: 61, withTag: otherTag)
    defer { KeyboardOffsetProvider.shared.removeOffset(forTextInputNativeID: otherNativeID, withTag: otherTag) }

    XCTAssertTrue(otherInput.becomeFirstResponder())

    XCTAssertEqual(controller.view.keyboardLayoutGuide.keyboardDismissPadding, 61)
    XCTAssertNil(otherInput.inputAccessoryView)
  }

  func testPreservesACustomInputAccessory() {
    let accessory = UIView(frame: CGRect(x: 0, y: 0, width: 300, height: 40))
    input.inputAccessoryView = accessory
    NotificationCenter.default.post(name: .keyboardDidAppear, object: nil)

    XCTAssertTrue(input.inputAccessoryView === accessory)
    XCTAssertEqual(controller.view.keyboardLayoutGuide.keyboardDismissPadding, 12)
  }
}
