# chrome voger

a manifest v3 chrome extension that blocks webrtc connections outside a page-level allowlist and forces youtube watch pages to the highest available quality.

everything runs locally, with no popup, options page, telemetry, remote code, or data collection.

## features

- blocks page-level webrtc peer connections except on `ampcode.com` and its subdomains. the browser-wide `disable_non_proxied_udp` policy still applies to allowlisted pages.
- selects the highest exposed player quality on youtube watch pages, up to `highres` for 8k, and reapplies the choice after same-tab navigation and each new video load.

## install

open `chrome://extensions`, enable developer mode, click load unpacked, and select the repository root. no configuration is needed.

## permissions

only `privacy`, required to set the webrtc ip handling policy.

## develop

each feature has a directory under `src/` and a matching test file. run `node --test` from the repository root.
