# Validation

## Static checks

Run these checks after implementation changes:

```bash
python3 -m json.tool manifest.json >/dev/null
node --check src/service-worker.js
node --check src/webrtc-blocker.js
node --check src/youtube-quality.js
```

## Browser checks

Load the repository root from `chrome://extensions` with developer mode enabled.

Check WebRTC behavior:

- Open a WebRTC leak test page.
- Confirm no local IP address appears.
- Run `new RTCPeerConnection()` in the page console and confirm it throws.

Check YouTube behavior:

- Open a YouTube video with 4k or 8k available.
- Confirm the player moves to the highest exposed quality.
- Navigate to another video in the same tab and confirm enforcement runs again.

## Known limits

- YouTube player methods are private and may change.
- The extension does not implement YouTube menu automation.
- The extension does not provide a disable switch while enabled.
