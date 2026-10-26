# Browser checks

Run `node test/browser/landing-components.mjs` for the landing page's live component
grid: animated hero-style mosaics, hover settling, button feedback, slider and
switch keyboard input, Gooey Nav selection,
Curved Navbar opening and focus recovery, Orb state cycling, live clock updates,
state across theme changes, aligned 320–1440px layouts, reduced motion, and route cleanup.
It accepts the environment variables below and optionally saves `inside-*.png`.

The Prompt Composer check exercises the public studio in Chrome: card hover and
keyboard selection, the shared model highlight, switching from pointer hover to
keyboard navigation, async submit and retry, voice preview cancellation and
transcript insertion, disabled controls, themes, 390px layout, reduced motion,
and the Pin UI attribution link.

Start the app with `npm run dev`, then run with an available Playwright installation:

```sh
node test/browser/prompt-composer.mjs
```

Run `node test/browser/component-studio.mjs` for Gooey Nav centering, component
dragging, canvas panning, zoom/reset, keyboard movement, component switching,
Pixel Card customization and reset, canvas sizing and pointer/focus alignment at
50%, 100%, and 150% zoom, color swatches, mobile layout, and reduced motion. The
hidden Spotlight Card's actual pointer handler is transpiled from source and
checked against scaled browser geometry without adding a public route. It uses
the same environment variables below and optionally saves `studio-mobile.png`.

If Playwright is supplied by your environment rather than installed in this
repository, set `PLAYWRIGHT_MODULE` to its absolute module entry point. The check
uses the installed Chrome channel by default; no browser or npm dependency is
added to the application.

Optional environment variables:

- `BASE_URL`: application origin, default `http://localhost:3000`.
- `PLAYWRIGHT_CHANNEL`: browser channel, default `chrome`.
- `SCREENSHOT_DIR`: output folder for light, dark, model-hover, mobile and full-studio screenshots.

The browser check is separate from `npm test`, which runs the repository's Node
tests. It does not access a real microphone or an external transcription service.
Real recording needs a consumer-provided `onTranscribe` callback and HTTPS or
localhost. The studio explicitly enables a simulated voice preview.

Run `node test/browser/thinking-panel.mjs` for the Thinking Panel's seven-second
playback, stopped completion timer, safe source links, local SVG brand marks,
shared source-chip hover highlight, pointer-to-keyboard focus changes, disclosure
focus recovery, rapid spring interruption, row alignment, live customization and
reset, interrupted/replayed searches, light/dark themes, 320–1440px layouts, live
reduced-motion changes and touch. It uses the same environment variables above
and optionally saves light, dark, expanded, hover, mobile and studio screenshots.
The demo explicitly simulates activity; the installable primitive receives real
sources, steps and status from its consumer. Remount it with a request key to
reset its internal timer, or provide application-controlled `elapsedSeconds`.

Run `node test/browser/thinking-panel-props.mjs` for isolated public API checks:
controlled disclosure and timing, empty states, unsafe link fallback, source-label
updates during hover, stable callback refs, React 19 cleanup callbacks and legacy
ref detachment. It builds a temporary browser fixture with Next.js's bundled
Webpack and the existing TypeScript installation; no extra dependency is needed.

Run `node test/browser/meet-team.mjs` for Meet Team selection, portrait centering,
mouse exploration, dragging at 50% and 150% canvas zoom, content editing, motion
presets, reset, missing images, member addition/removal, empty and single-member
states, dark theme, 390px touch dragging, and reduced motion. It accepts the same
environment variables and optionally saves `meet-team-*.png` screenshots.

Run `node test/browser/hero-section.mjs` for landing hero centering, rounded CandyButton
actions, light/dark themes, continuous motion and palette blending across theme
changes, logo-blue tiles, website-wide progressive viewport blur aligned during scrolling,
click-through and keyboard interaction, persistence across routes,
live Liquid Media canvas integration, resizing at
1440px, 768px, 390px and 320px, dynamic reduced-motion preferences, and navigation
cleanup. It accepts the environment variables above and saves `hero-*.png`
screenshots when `SCREENSHOT_DIR` is set. Use `localhost` for the development
server so Next.js can connect its development client using its allowed origin.

Run `node test/browser/landing-scroll-story.mjs` for the section below the hero:
medium typography across four or five desktop lines, no divider, hero-only
mosaic artwork, progressive and reversible reveals, completion within the page's
scroll range, light/dark themes, 320px and 390px layouts, and reduced motion.
It accepts the same environment variables and optionally saves `scroll-story-*.png`.

Run `node test/browser/meet-team-props.mjs` for isolated public API regressions
without React Compiler: fresh member arrays during motion and dragging, pointer
exit settling, asynchronous loading, current callback data, reordering, and
selected-member removal. It builds a temporary fixture with the existing Next.js
Webpack and TypeScript packages and accepts the environment variables above.
