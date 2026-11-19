package com.example.reactnativekeyboardcontroller;

import android.content.Intent;
import android.os.Build;

import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;

import java.io.IOException;
import java.util.List;
import java.util.regex.Pattern;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.rule.ActivityTestRule;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.Until;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {
    @Rule // (2)
    public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

    @Test
    public void runDetoxTests() throws IOException {
        if (Build.VERSION.SDK_INT >= 37) {
            configureGboard();
        }

        DetoxConfig detoxConfig = new DetoxConfig();
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
        detoxConfig.rnContextLoadTimeoutSec = (BuildConfig.DEBUG ? 180 : 60);

        Detox.runTests(mActivityRule, detoxConfig);
    }

    private void configureGboard() throws IOException {
        // Keep keyboard capitalization deterministic for screenshot comparisons.
        UiDevice device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        device.executeShellCommand("am start -W -f "
            + (Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK) + " -n "
            + "com.google.android.inputmethod.latin/"
            + "com.google.android.apps.inputmethod.latin.preference.SettingsActivity");

        UiObject2 corrections = device.wait(Until.findObject(
            By.text(Pattern.compile("Text correction|Corrections & suggestions"))), 10000);
        assertNotNull("Gboard correction settings must be available", corrections);
        corrections.click();

        UiObject2 capitalization = device.wait(Until.findObject(
            By.textStartsWith("Auto-capitalization")), 10000);
        assertNotNull("Gboard auto-capitalization must be available", capitalization);

        UiObject2 toggle = null;
        for (UiObject2 row = capitalization; row != null; row = row.getParent()) {
            if (row.isCheckable()) {
                toggle = row;
                break;
            }
            List<UiObject2> switches = row.findObjects(By.checkable(true));
            if (switches.size() == 1) {
                toggle = switches.get(0);
                break;
            }
        }
        assertNotNull("Gboard auto-capitalization switch must be available", toggle);
        if (toggle.isChecked()) {
            toggle.click();
        }
        assertTrue("Gboard auto-capitalization must be disabled",
            Boolean.TRUE.equals(toggle.wait(Until.checked(false), 10000)));

        device.pressBack();
        device.pressBack();
        device.pressHome();
    }
}
