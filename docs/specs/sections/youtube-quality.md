# YouTube quality enforcement

YouTube quality enforcement sets a YouTube watch page to the highest player quality exposed for the current video. The script avoids menu automation and does not add extension UI.

## Scope

The `src/youtube-quality.js` script targets YouTube watch pages only. The script does not:

- Open YouTube menus.
- Click player controls.
- Parse localized UI text.
- Add extension UI.

## Player access

The script runs in the main world and reads the page player from the following selector:

```text
.html5-video-player
```

The script calls the following methods exposed by the page player when available:

- `getAvailableQualityLevels()`
- `setPlaybackQualityRange(quality)`
- `setPlaybackQuality(quality)`

These methods are not part of the supported public IFrame API. The implementation treats missing methods as a retryable failure rather than a reason to introduce UI automation.

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

## Scheduling

The script schedules a quality attempt in the following situations:

- The script loads for the first time.
- YouTube emits the `yt-navigate-finish` event.
- A video element emits the `loadedmetadata` event.

Non-watch pages do not schedule quality work. When the player or the quality list is not ready, the script retries with bounded delays. After a successful setter call, the script schedules several rechecks to counter automatic quality changes by YouTube.

## Verification

Confirm the following results after loading the extension:

- A video that exposes 8k as `highres` receives `highres`.
- A video that exposes `hd2160` and no higher level receives `hd2160`.
- Same-tab navigation on YouTube triggers a new quality attempt.
- Non-watch YouTube pages do not perform quality work.
