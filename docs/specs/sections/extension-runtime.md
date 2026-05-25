# Extension Runtime

## Manifest

`manifest.json` defines a Manifest V3 extension with:

- `privacy` permission for Chrome WebRTC IP handling policy.
- A background service worker at `src/service-worker.js`.
- A main-world WebRTC blocker injected on all URLs at `document_start`.
- A main-world YouTube quality script injected on `youtube.com` frames at
  `document_start`.

## Startup behavior

The service worker applies Chrome's WebRTC IP handling policy when:

- the extension is installed,
- Chrome starts,
- the service worker is loaded.

The current product has no runtime settings. WebRTC blocking and YouTube quality
enforcement are always enabled while the extension is enabled.

## Content script worlds

Both content scripts run in the main world because they must affect page-owned
objects:

- WebRTC blocking replaces page-visible constructors.
- YouTube quality enforcement calls methods exposed by YouTube's page player.

The WebRTC blocker runs in all frames, including `about:blank`, `blob:`, and
`data:` descendants. This keeps generated child frames inside the same blocking
model.
