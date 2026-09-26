# WebRTC blocking

WebRTC blocking uses two layers: a Chrome privacy policy applied by the service worker, and a page-level constructor replacement applied by a content script. The slice lives in `src/webrtc-blocking/`.

## Browser policy layer

The `service-worker.js` file sets the following Chrome policy when the extension is installed or updated. This layer requires the `privacy` permission.

```text
chrome.privacy.network.webRTCIPHandlingPolicy = disable_non_proxied_udp
```

Chrome persists the value across restarts. When an enterprise policy or a later-installed extension controls the same setting, that controller takes precedence, and the value from this extension takes effect again as soon as the other controller releases the setting.

This layer reduces IP leak risk by disabling non-proxied UDP paths. The policy is not a complete WebRTC kill switch.

## Page API layer

The `content-script.js` file replaces the following page-visible constructors when present:

- `RTCPeerConnection`
- `webkitRTCPeerConnection`

Each replacement throws a `SecurityError`. Page code cannot restore the original constructor, and assignments to the property are silently ignored so that polyfill code keeps running. `RTCDataChannel` needs no replacement because page code can only create a data channel from a peer connection.

The manifest injects the script with the following settings:

- All URLs at `document_start`, before page scripts run.
- The main world, because the script replaces page-visible globals.
- All frames with `match_origin_as_fallback`, so that `about:blank`, `about:srcdoc`, `blob:`, and `data:` child frames receive the same replacement.

## Verification

Confirm the following results after loading the extension:

- A WebRTC leak test page does not expose local IP addresses or a non-proxied public IP address.
- Calling `new RTCPeerConnection()` in the page console throws a `SecurityError`.
- Non-WebRTC browsing continues to work.
