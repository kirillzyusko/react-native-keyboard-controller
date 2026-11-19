# Screen Inspection and Validation

## Inspection checklist

Answer these from code before choosing a component:

### Layout

- Which node fills the screen?
- Which node owns vertical scrolling?
- Is there a fixed footer, composer, bottom tab, safe-area spacer, or bottom sheet?
- Are inputs inside a modal or a screen that remains mounted behind navigation?
- Does content use flex distribution that must reflow?

### Input behavior

- How many inputs exist and can any be disabled or dynamically mounted?
- Can an input grow multiline?
- Does focus need previous/next navigation?
- Must the keyboard remain focused while showing an overlay or custom panel?
- Must the user drag the keyboard interactively?

### Product semantics

- For chat, should content always lift, lift only at the end, remain lifted after close, or never lift?
- Must an emoji picker or bottom sheet replace the keyboard without moving messages?
- Must a sent AI message anchor near the top while a response streams?
- Should the system keyboard remain translucent, match the app, or reveal an animated background?

### Runtime ownership

- Is `KeyboardProvider` mounted once at the application root?
- Is Reanimated installed and compatible with the app architecture?
- Does another library take control of edge-to-edge or window insets?
- Is Android `windowSoftInputMode` global, screen-scoped, or changed by multiple hooks?
- Are both the legacy and new keyboard implementations mounted at the same time?

## Selection principles

1. Give one layer ownership of scroll repositioning.
2. Give one layer ownership of fixed-element translation.
3. Keep business-state subscriptions separate from animation values.
4. Prefer the package component that encodes the product behavior over handwritten event math.
5. Preserve app-specific navigation, safe-area, bottom-sheet, and list contracts.

## Validation matrix

Run only the rows relevant to the screen, but cover both target platforms.

| Area              | Checks                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Basic             | Focus first and last input; open and close keyboard; tap outside; use hardware back on Android |
| Focus             | Move next and previous; skip disabled inputs; dynamically add or remove an input               |
| Layout            | Header offset; safe area; bottom tabs; rotation; split screen; modal presentation              |
| Scroll            | Short and long content; top, middle, and end positions; momentum during open or close          |
| Multiline         | Grow and shrink composer; switch keyboard type or emoji keyboard                               |
| Interactive       | Slow drag, fast dismissal, cancellation, swipe up where supported                              |
| Navigation        | Push, pop, native interactive pop, switch tabs, return to a still-mounted screen               |
| Accessibility     | Large text, screen reader focus, custom toolbar labels, reduced motion where relevant          |
| Keyboard variants | Predictive bar, floating keyboard, physical keyboard, different input types                    |

## Evidence-first output

When explaining a choice, point to the actual scroll owner and fixed-element boundary in the user's code. State what each rejected component would incorrectly resize, translate, overlay, or subscribe to. If the code is incomplete, make the smallest explicit assumption and keep the recommendation reversible.
