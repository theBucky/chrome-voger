# Chrome Voger engineering specifications

Chrome Voger is a Manifest V3 Chrome extension with two features:

- WebRTC blocking reduces the risk of WebRTC IP address leaks.
- YouTube quality enforcement moves YouTube watch pages to the highest available player quality.

Both features stay active while the extension is enabled. The extension has no popup, no options page, no settings, no telemetry, and no UI automation.

## Feature slices

Each feature is a vertical slice that owns its manifest entries, scripts, specification section, and tests. Slices share no code or state.

| Feature | Source | Specification | Tests |
| --- | --- | --- | --- |
| WebRTC blocking | `src/webrtc-blocking/` | [WebRTC blocking](sections/webrtc-blocking.md) | `test/webrtc-blocking.test.mjs` |
| YouTube quality enforcement | `src/youtube-quality/` | [YouTube quality enforcement](sections/youtube-quality.md) | `test/youtube-quality.test.mjs` |

Within a slice, `service-worker.js` runs as the extension service worker and `content-script.js` runs in web pages. Chrome allows one service worker per extension, and the WebRTC blocking slice currently owns it. Content scripts run in the page main world and keep every binding in block or function scope, so no name leaks into page globals.

To check a change, see [Validation](sections/validation.md).

## Implementation constraints

- The extension has no external dependencies.
- All logic runs locally in the browser.
- The extension does not load remote code.
- The extension does not collect or transmit user data.
- The extension does not add UI fallback behavior unless UI implementation becomes an explicit requirement.
