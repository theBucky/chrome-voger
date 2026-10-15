# WebRTC blocking

WebRTC blocking uses two layers: a Chrome privacy policy applied by the service worker, and a page-level constructor replacement applied by a content script. The slice lives in `src/webrtc-blocking/`.

## Browser policy layer

The `service-worker.js` file sets the following Chrome policy when the extension is installed or updated. This layer requires the `privacy` permission.

```text
chrome.privacy.network.webRTCIPHandlingPolicy = disable_non_proxied_udp
```

Chrome persists the value across restarts. When an enterprise policy or a later-installed extension controls the same setting, that controller takes precedence, and the value from this extension takes effect again as soon as the other controller releases the setting.

the [browser-wide policy](https://developer.chrome.com/docs/extensions/reference/api/privacy#property-network-webRTCIPHandlingPolicy) disables non-proxied udp on every site, including allowlisted pages. this reduces ip leak risk but may prevent connections that require that transport. other webrtc transports remain available.

## Page API layer

The `content-script.js` file replaces the following page-visible constructors when present:

- `RTCPeerConnection`
- `webkitRTCPeerConnection`

Each replacement throws a `SecurityError`. Page code cannot restore the original constructor, and assignments to the property are silently ignored so that polyfill code keeps running. `RTCDataChannel` needs no replacement because page code can only create a data channel from a peer connection.

The manifest injects the script with the following settings:

- All URLs outside the allowlist at `document_start`, before page scripts run.
- The main world, because the script replaces page-visible globals.
- All frames with `match_origin_as_fallback`, so that `about:blank`, `about:srcdoc`, `blob:`, and `data:` child frames receive the same replacement.

the `exclude_matches` rule `*://*.ampcode.com/*` exempts `ampcode.com` and every subdomain over http and https, on all paths and ports. domain boundaries exclude lookalikes such as `fakeampcode.com` and `ampcode.com.example.org`.

chrome [matches each frame independently](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#exclude-matches-and-globs); related frames use their initiator's origin. third-party frames outside the allowlist remain blocked.

reload the extension and affected pages after changing the allowlist; existing constructor replacements cannot be undone.

## Verification

Confirm the following results after loading the extension:

- A WebRTC leak test page does not expose local IP addresses or a non-proxied public IP address.
- Calling `new RTCPeerConnection()` on a non-allowlisted page throws a `SecurityError`.
- `new RTCPeerConnection()` succeeds on `https://ampcode.com/` and its subdomains; close the connection after checking.
- Non-WebRTC browsing continues to work.
