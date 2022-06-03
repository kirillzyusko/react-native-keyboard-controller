---
sidebar_position: 1
---

# Platforms capabilities and limitations

This library relies on `WindowInsetsCompat` API on `Android` and keyboard listeners (`NotificationCenter`) on iOS.

Since two platforms are totally different (see below for more details) the purpose of this API is to provide a common API for both platforms, which will work in the same way on both platforms, but at the same time give an access to all power of the platform possibilities.