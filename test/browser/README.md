# Browser checks

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
