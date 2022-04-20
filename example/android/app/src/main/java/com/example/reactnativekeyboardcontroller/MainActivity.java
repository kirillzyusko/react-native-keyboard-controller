package com.example.reactnativekeyboardcontroller;

import android.os.Bundle;

import androidx.core.view.WindowCompat;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "KeyboardControllerExample";
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Tell the Window that our app is going to responsible for fitting for any system windows.
    WindowCompat.setDecorFitsSystemWindows(this.getWindow(), false);
  }
}
