# WebRTC Blocking

## Browser policy layer

`src/service-worker.js` sets:

```text
chrome.privacy.network.webRTCIPHandlingPolicy = disable_non_proxied_udp
```

The service worker first reads `levelOfControl`. It writes the policy only when
Chrome reports that this extension can control the setting.

This layer reduces IP leak risk by disabling non-proxied UDP paths. The policy is
not treated as a complete WebRTC kill switch.

## Page API layer

`src/webrtc-blocker.js` runs at `document_start` and replaces these page-visible
constructors when present:

- `RTCPeerConnection`
- `webkitRTCPeerConnection`
- `RTCDataChannel`

Each replacement throws a `SecurityError` with an English message. This prevents
ordinary page code from creating peer connections or data channels.

## Acceptance checks

- A WebRTC leak test page does not expose local IP addresses or a non-proxied
  public IP address.
- `new RTCPeerConnection()` throws in the page console.
- Normal non-WebRTC browsing still works.
