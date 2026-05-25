# Chrome Voger engineering specifications

Chrome Voger is a Manifest V3 Chrome extension with two default behaviors:

- Blocks WebRTC traffic to reduce the risk of WebRTC IP address leaks.
- Forces YouTube watch pages to request the highest available player quality.

The extension contains no popup, no options page, no telemetry, and no UI automation.

## Sections

- [Extension runtime](sections/extension-runtime.md)
- [WebRTC blocking](sections/webrtc-blocking.md)
- [YouTube quality enforcement](sections/youtube-quality.md)
- [Validation](sections/validation.md)

## File map

```text
manifest.json
src/
  service-worker.js
  webrtc-blocker.js
  youtube-quality.js
```

## Implementation constraints

- The extension has no external dependencies.
- All logic runs locally in the browser.
- The extension does not load remote code.
- The extension does not collect or transmit user data.
- The extension does not add UI fallback behavior unless UI implementation becomes an explicit requirement.
