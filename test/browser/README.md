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
