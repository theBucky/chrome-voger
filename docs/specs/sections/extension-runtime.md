# Extension runtime

The extension runtime defines how Chrome Voger registers with Chrome, when the service worker applies the WebRTC policy, and which world the content scripts run in.

## Manifest configuration

The `manifest.json` file declares a Manifest V3 extension with the following items:

- The `privacy` permission, which controls the Chrome WebRTC IP handling policy.
- A background service worker at `src/service-worker.js`.
- A main-world WebRTC blocker injected on all URLs at `document_start`.
- A main-world YouTube quality script injected on `youtube.com` frames at `document_start`.

## Startup behavior

The service worker applies the Chrome WebRTC IP handling policy in the following situations:

- The extension is installed.
- Chrome starts.
- The service worker loads.

The extension exposes no runtime settings. WebRTC blocking and YouTube quality enforcement remain active while the extension is enabled.

## Content script worlds

Both content scripts run in the main world because the scripts must access page-owned objects:

- WebRTC blocking replaces page-visible constructors.
- YouTube quality enforcement calls methods exposed by the YouTube page player.

The WebRTC blocker runs in all frames, including `about:blank`, `blob:`, and `data:` descendants. This configuration applies the same blocking model to generated child frames.
