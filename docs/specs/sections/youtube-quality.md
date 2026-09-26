# YouTube quality enforcement

YouTube quality enforcement sets a YouTube watch page to the highest player quality exposed for the current video. The slice lives in `src/youtube-quality/`.

## Scope

The `content-script.js` file acts only on YouTube watch pages, where the path is `/watch`. The script does not:

- Open YouTube menus.
- Click player controls.
- Parse localized UI text.
- Add extension UI.

YouTube navigates between pages without a reload, so the manifest injects the script into the top frame of every `*://*.youtube.com/*` page at `document_start`, before the first navigation event. The script runs in the main world because the player methods belong to page code.

## Player access

The script reads the watch page player from the element with the `movie_player` ID. The generic `.html5-video-player` class also matches the inline preview player that YouTube creates when a pointer hovers over a thumbnail.

The script calls the following methods exposed by the page player:

- `getAvailableQualityLevels()`
- `setPlaybackQualityRange(quality, quality)`, where equal minimum and maximum values pin the player to one quality.

The legacy `setPlaybackQuality(quality)` method no longer changes the quality, so the script does not call it. These methods are not part of the supported public IFrame API, and YouTube can change them at any time. When the player or these methods are not ready, the script leaves the player unchanged and waits for the next event rather than introducing UI automation.

## Quality priority order

The script selects the first available quality from this list:

1. `highres`
2. `hd4320`
3. `hd2880`
4. `hd2160`
5. `hd1440`
6. `hd1080`
7. `hd720`
8. `large`
9. `medium`
10. `small`
11. `tiny`

YouTube can expose 8k video as `highres` in `adaptiveFormats`. For example, a stream with `qualityLabel: "4320p60"` reports `quality: "highres"`. For this reason, `highres` ranks above the named HD levels.

When the player exposes none of these levels, for example only `auto`, the attempt fails.

## Scheduling

The script applies the quality on the following events while the tab is on a watch page:

- `loadedmetadata` from a media element, which fires for each new video source, including ads. The player lists its quality levels by this point.
- `yt-navigate-finish`, which YouTube emits after the first page load and after each same-tab navigation. This event covers a video that loaded in the miniplayer before the tab returned to the watch page.

Because the minimum and maximum are equal, YouTube keeps the pinned quality, even on a slow network, so the script needs no timers or rechecks. A later manual choice stays in place until the next event, such as a new video or an ad.

## Verification

Confirm the following results after loading the extension:

- A video that exposes 8k as `highres` receives `highres`.
- A video that exposes `hd2160` and no higher level receives `hd2160`.
- Same-tab navigation to another video triggers a new quality attempt.
- Non-watch YouTube pages keep their player quality.
