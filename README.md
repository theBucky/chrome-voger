# Chrome Voger

Chrome Voger is a Manifest V3 Chrome extension that blocks WebRTC traffic and forces YouTube watch pages to the highest available player quality.

The extension runs locally with no popup, no options page, no telemetry, and no UI automation. The extension loads no remote code and collects no user data.

## Features

- **WebRTC blocking.** Sets the Chrome WebRTC IP handling policy to `disable_non_proxied_udp`, and replaces the `RTCPeerConnection` and `webkitRTCPeerConnection` constructors with stubs that throw `SecurityError`. The content script runs at `document_start` in all frames, including `about:blank`, `blob:`, and `data:` descendants.
- **YouTube quality enforcement.** On YouTube watch pages, selects the highest exposed player quality (up to `highres` for 8k content) and reapplies the choice after same-tab navigation and each new video load.

## Install

1. Clone or download the repository.
2. Open `chrome://extensions` in Chrome and enable developer mode.
3. Click **Load unpacked** and select the repository root.

The extension activates automatically and requires no configuration.

## Permissions

The extension declares only the `privacy` permission, which is required to set the Chrome WebRTC IP handling policy.

## Develop

Each feature lives in its own directory under `src/`, with a matching specification section and test file. Run the automated checks from the repository root:

```bash
node --test
```

For the source layout, browser checks, and implementation constraints, see the [engineering specifications](docs/specs/index.md).
