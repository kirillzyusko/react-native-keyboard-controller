---
slug: fabric
title: Version 1.2.0 with new architecture support
authors: [kirill]
tags: [react-native, release, new architecture, fabric, turbo modules]
keywords:
  [
    react-native-keyboard-controller,
    react-native,
    fabric,
    new architecture,
    support,
  ]
---

I'm glad to announce, that new upcoming release `1.2.0` brings a support for new react native architecture 😎

Fortunately this library is backward compatible with old architecture and will be compiled conditionally depending on which architecture you are using. So don't be afraid of updating it to the latest version - it doesn't have any breaking changes!

<div className="playwright">
  ![react native logo](./react-native.png#img-thumbnail)
</div>

<!--truncate-->

The decision to add support for a new architecture (to prioritize a new architecture adoption over other features) was made in order to understand all peculiarities of the new architecture and to discover its possibilities. Hopefully such knowledge can help add new features for the library in the future.

Obviously, the migration process will take some time for other libraries, so future versions of this library will still support two architectures. When most other open source libraries will be migrated to the new architecture and the new architecture becomes the standard in the react native ecosystem, then support for the old architecture will be removed.

Stay tuned for future updates! 😊
