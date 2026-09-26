# Validation

Validation confirms that the extension loads correctly and that each feature behaves as specified.

## Prerequisites

- Node.js 22 or later and Chrome are installed.
- The repository is available on the local machine.

## Run automated checks

Run the following command from the repository root after any source or manifest change:

```bash
node --test
```

The command must exit without error. The tests load each script from the path declared in `manifest.json`, so a broken manifest path, a syntax error, or a behavior regression fails the run.

## Verify browser behavior

To load the extension and confirm runtime behavior in Chrome:

1. Open `chrome://extensions` and enable developer mode.
2. Click **Load unpacked** and select the repository root.
3. Confirm the results listed in the verification section of each feature:
   - [WebRTC blocking](webrtc-blocking.md#verification)
   - [YouTube quality enforcement](youtube-quality.md#verification)
