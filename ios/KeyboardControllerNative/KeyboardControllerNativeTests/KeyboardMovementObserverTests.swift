//
//  KeyboardMovementObserverTests.swift
//  KeyboardControllerNativeTests
//
//  Created by Harris Robin Kalash on 10/10/2026.
//

@testable import KeyboardControllerNative
import XCTest

final class KeyboardMovementObserverTests: XCTestCase {
  var observer: KeyboardMovementObserver!
  var moveStartHeights: [NSNumber] = []

  override func setUpWithError() throws {
    super.setUp()

    moveStartHeights = []
    KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = false
    observer = KeyboardMovementObserver(
      handler: { [weak self] event, height, _, _, _ in
        if event == "onKeyboardMoveStart" {
          self?.moveStartHeights.append(height)
        }
      },
      onNotify: { _, _ in },
      onRequestAnimation: {},
      onCancelAnimation: {}
    )
    observer.mount()
  }

  override func tearDownWithError() throws {
    observer.unmount()
    observer = nil
    KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = false

    super.tearDown()
  }

  private func post(_ name: Notification.Name, keyboardHeight: CGFloat) {
    let screen = UIScreen.main.bounds
    let frame = CGRect(
      x: 0,
      y: screen.height - keyboardHeight,
      width: screen.width,
      height: keyboardHeight
    )

    NotificationCenter.default.post(
      name: name,
      object: nil,
      userInfo: [
        UIResponder.keyboardFrameEndUserInfoKey: NSValue(cgRect: frame),
        UIResponder.keyboardAnimationDurationUserInfoKey: 0.25,
      ]
    )
  }

  func testIgnoresKeyboardWillShowEchoedAfterInputViewsReload() {
    // `KeyboardAreaExtender` arms the flag before `reloadInputViews()` to swallow its echo
    KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = true

    post(UIResponder.keyboardWillShowNotification, keyboardHeight: 336)

    XCTAssertEqual(moveStartHeights, [])
    XCTAssertFalse(KeyboardEventsIgnorer.shared.shouldIgnore)
  }

  func testDoesNotIgnoreKeyboardWillShowWhenKeyboardHidBeforeTheEcho() {
    // the keyboard gets minimized (hardware keyboard) instead of echoing `keyboardWillShow`
    KeyboardEventsIgnorer.shared.shouldIgnoreKeyboardEvents = true

    post(UIResponder.keyboardWillHideNotification, keyboardHeight: 336)
    post(UIResponder.keyboardWillShowNotification, keyboardHeight: 336)

    XCTAssertEqual(moveStartHeights, [0, 336])
  }
}
