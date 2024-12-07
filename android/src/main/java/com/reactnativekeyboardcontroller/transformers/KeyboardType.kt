package com.reactnativekeyboardcontroller.transformers

import android.text.InputType

private const val INPUT_TYPE_KEYBOARD_NUMBER_PAD = InputType.TYPE_CLASS_NUMBER
private const val INPUT_TYPE_KEYBOARD_DECIMAL_PAD = INPUT_TYPE_KEYBOARD_NUMBER_PAD or InputType.TYPE_NUMBER_FLAG_DECIMAL
private const val INPUT_TYPE_KEYBOARD_NUMBERED = INPUT_TYPE_KEYBOARD_DECIMAL_PAD or InputType.TYPE_NUMBER_FLAG_SIGNED

fun getKeyboardTypeFromInputType(inputType: Int?): String {
  if (inputType == null) {
    return "default"
  }

  return when {
    // Check for numeric input types
    inputType and InputType.TYPE_CLASS_NUMBER != 0 -> {
      when {
        inputType and InputType.TYPE_NUMBER_FLAG_DECIMAL != 0 -> "decimal-pad"
        inputType and INPUT_TYPE_KEYBOARD_NUMBERED != 0 -> "numeric"
        else -> "number-pad"
      }
    }
    // Check for email address type
    inputType and InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS != 0 -> "email-address"

    // Check for phone pad type
    inputType and InputType.TYPE_CLASS_PHONE != 0 -> "phone-pad"

    // Check for URL type
    inputType and InputType.TYPE_TEXT_VARIATION_URI != 0 -> "url"

    // Check for visible password type
    inputType and InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD != 0 -> "visible-password"

    // Default case
    else -> "default"
  }
}


