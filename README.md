# Chrome Voger

Chrome Voger is a Manifest V3 Chrome extension that blocks WebRTC traffic and forces YouTube watch pages to the highest available player quality.

The extension runs locally with no popup, no options page, no telemetry, and no UI automation.

## Features

- **WebRTC blocking.** Sets the Chrome WebRTC IP handling policy to `disable_non_proxied_udp`, and replaces the `RTCPeerConnection`, `webkitRTCPeerConnection`, and `RTCDataChannel` constructors with stubs that throw `SecurityError`. The content script runs at `document_start` in all frames, including `about:blank`, `blob:`, and `data:` descendants.
- **YouTube quality enforcement.** On YouTube watch pages, selects the highest exposed player quality (up to `highres` for 8k content) and reapplies the choice after same-tab navigation and `loadedmetadata` events.

## Install

1. Clone or download the repository.
2. Open `chrome://extensions` in Chrome and enable developer mode.
3. Click **Load unpacked** and select the repository root.

The extension activates automatically and requires no configuration.

## Permissions

The extension declares only the `privacy` permission, which is required to set the Chrome WebRTC IP handling policy.

## Project layout

```text
manifest.json          extension manifest
src/service-worker.js  applies the WebRTC IP handling policy
src/webrtc-blocker.js  blocks WebRTC constructors at document_start
src/youtube-quality.js forces the highest player quality on watch pages
docs/specs/            engineering specifications
```

## Validate

Run the static checks from the repository root after any source change:

```bash
python3 -m json.tool manifest.json >/dev/null
node --check src/service-worker.js
node --check src/webrtc-blocker.js
node --check src/youtube-quality.js
```

For browser validation steps, see [docs/specs/sections/validation.md](docs/specs/sections/validation.md).

## Documentation

For implementation details, see the [engineering specifications](docs/specs/index.md).

## Implementation constraints

- No external dependencies.
- All logic runs locally in the browser.
- No remote code is loaded.
- No user data is collected or transmitted.
