# Validation

Validation confirms that the extension parses correctly and that the WebRTC and YouTube behaviors run as expected.

## Prerequisites

- Node.js, Python 3, and Chrome are installed.
- The repository is available on the local machine.

## Run static checks

Run the following commands from the repository root after any source change:

```bash
python3 -m json.tool manifest.json >/dev/null
node --check src/service-worker.js
node --check src/webrtc-blocker.js
node --check src/youtube-quality.js
```

All four commands must exit without error.

## Verify browser behavior

To load the extension and confirm runtime behavior in Chrome:

1. Open `chrome://extensions` and enable developer mode.
2. Click **Load unpacked** and select the repository root.
3. Confirm WebRTC behavior:
   - Open a WebRTC leak test page.
   - Confirm that no local IP address appears.
   - In the page console, run `new RTCPeerConnection()` and confirm that the call throws.
4. Confirm YouTube behavior:
   - Open a YouTube video that exposes 4k or 8k.
   - Confirm that the player moves to the highest exposed quality.
   - Navigate to another video in the same tab and confirm that enforcement runs again.

## Known limitations

- The YouTube page player methods are private, and the YouTube team can change the methods at any time.
- The extension does not automate the YouTube quality menu.
- The extension does not provide a runtime disable switch.
