package com.reactnativekeyboardcontroller.transformers

import android.text.InputType

fun getKeyboardTypeFromInputType(inputType: Int?): String {
  if (inputType == null) {
    return "default"
  }

  // Extract base input type class
  val inputTypeClass = inputType and InputType.TYPE_MASK_CLASS
  val inputTypeVariation = inputType and InputType.TYPE_MASK_VARIATION

  // Check for special input types
  return when {
    inputTypeVariation == InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS -> "email-address"
    inputTypeVariation == InputType.TYPE_TEXT_VARIATION_URI -> "url"
    inputTypeVariation == InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD -> "visible-password"

    // Check for specific input type classes
    inputTypeClass == InputType.TYPE_CLASS_NUMBER ->
      when {
        (inputType and InputType.TYPE_NUMBER_FLAG_DECIMAL) != 0 &&
          (inputType and InputType.TYPE_NUMBER_FLAG_SIGNED) == 0 -> "decimal-pad"

        (inputType and InputType.TYPE_NUMBER_FLAG_SIGNED) != 0 -> "numeric"

        else -> "number-pad"
      }

    inputTypeClass == InputType.TYPE_CLASS_PHONE -> "phone-pad"
    inputTypeClass == InputType.TYPE_CLASS_TEXT -> "default"

    else -> "default"
  }
}
