import { execSync } from "child_process";

import { device } from "detox";

export default async function setDemoMode(): Promise<void> {
  if (device.getPlatform() === "android") {
    // enter demo mode
    execSync("adb shell settings put global sysui_demo_allowed 1");
    // display time 12:00
    execSync(
      "adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 1200",
    );
    // Display full mobile data with 4g type and no wifi
    execSync(
      "adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e level 4 -e datatype none -e wifi false",
    );
    // Hide notifications
    execSync(
      "adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false",
    );
    // Show full battery but not in charging state
    execSync(
      "adb shell am broadcast -a com.android.systemui.demo -e command battery -e plugged false -e level 100",
    );
  } else {
    await device.setStatusBar({
      time: "09:41",
      dataNetwork: "wifi",
      wifiMode: "active",
      wifiBars: "3",
      cellularMode: "active",
      cellularBars: "4",
      batteryLevel: "100",
    });
  }
}
