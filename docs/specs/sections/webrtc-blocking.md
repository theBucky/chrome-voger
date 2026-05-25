# WebRTC blocking

WebRTC blocking uses two layers: a Chrome privacy policy applied by the service worker, and a page-level constructor replacement applied by a content script.

## Browser policy layer

The `src/service-worker.js` file sets the following Chrome policy:

```text
chrome.privacy.network.webRTCIPHandlingPolicy = disable_non_proxied_udp
```

The service worker first reads `levelOfControl`. The service worker writes the policy only when Chrome reports that this extension can control the setting.

This layer reduces IP leak risk by disabling non-proxied UDP paths. The policy is not a complete WebRTC kill switch.

## Page API layer

The `src/webrtc-blocker.js` script runs at `document_start` and replaces the following page-visible constructors when present:

- `RTCPeerConnection`
- `webkitRTCPeerConnection`
- `RTCDataChannel`

Each replacement throws a `SecurityError` with an English message. This replacement prevents page code from creating peer connections or data channels.

## Verification

Confirm the following results after loading the extension:

- A WebRTC leak test page does not expose local IP addresses or a non-proxied public IP address.
- Calling `new RTCPeerConnection()` in the page console throws an error.
- Non-WebRTC browsing continues to work.
