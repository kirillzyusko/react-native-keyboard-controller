# Interactive back swipe recordings

Each interaction is a separate MP4. `VideoComparison` starts the players together; the files are not combined into a composite.

| Files | Source |
| --- | --- |
| `notes.mp4`, `messages.mp4`, `instagram.mp4` | Actual apps on an iPhone 16 Pro, iOS 26.6.1, with sample content prepared by the maintainer. Captured through QuickTime over USB. |
| `native-default.mp4`, `native-dismiss.mp4`, `js-default.mp4` | FabricExample, iPhone 17 Pro simulator, iOS 26.5, React Native 0.87.1, screens 4.27.0. The policy is `null`. |

The clips show a canceled horizontal back gesture with the keyboard open. They are seven seconds long at normal speed, with the first screen movement aligned to two seconds. Audio and setup interactions are omitted. The Instagram clip pads its final still frame to match the other clips; the gesture and keyboard animation remain at normal speed. Raw recordings and reusable Argent flows remain local in `.argent/`.

Reference app versions: Notes 2.13 (2952.140.6.1), Messages 26.0 (1450.700.71.2.1), Instagram 451.0.0 (1088109557).
