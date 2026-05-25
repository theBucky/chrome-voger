# Chrome Voger Engineering Specs

Chrome Voger is a Manifest V3 Chrome extension with two default behaviors:

1. Block WebRTC traffic and reduce WebRTC IP leak risk.
2. Force YouTube watch pages to request the highest available player quality.

The implementation intentionally has no popup, no options page, no telemetry, and
no UI automation.

## Sections

- [Extension runtime](sections/extension-runtime.md)
- [WebRTC blocking](sections/webrtc-blocking.md)
- [YouTube quality enforcement](sections/youtube-quality.md)
- [Validation](sections/validation.md)

## Current file map

```text
manifest.json
src/
  service-worker.js
  webrtc-blocker.js
  youtube-quality.js
```

## Implementation constraints

- Keep the extension dependency-free.
- Keep all logic local to the browser.
- Do not load remote code.
- Do not collect or transmit user data.
- Do not add UI fallback behavior unless UI implementation becomes an explicit
  requirement.
