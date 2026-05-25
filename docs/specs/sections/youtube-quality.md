# YouTube Quality Enforcement

## Scope

`src/youtube-quality.js` only targets YouTube watch pages. The script does not
open YouTube menus, click controls, parse localized UI text, or add extension UI.

## Player access

The script runs in the main world and reads the page player from:

```text
.html5-video-player
```

It uses YouTube's page-exposed player methods when available:

- `getAvailableQualityLevels()`
- `setPlaybackQualityRange(quality)`
- `setPlaybackQuality(quality)`

These methods are not part of the supported public IFrame API. The implementation
therefore treats missing methods as a retryable failure, not as a reason to add UI
automation.

## Quality order

The implementation uses this priority order:

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

YouTube can expose 8k video as `highres` in `adaptiveFormats`, for example
`qualityLabel: "4320p60"` with `quality: "highres"`. `highres` therefore wins
over named HD levels.

## Scheduling

The script schedules a quality attempt when:

- the script first loads,
- YouTube emits `yt-navigate-finish`,
- a video element emits `loadedmetadata`.

Non-watch pages do not schedule quality work. If the player or quality list is
not ready, the script retries with bounded delays. After a successful setter
call, the script schedules a few rechecks to counter YouTube's own automatic
quality changes.

## Acceptance checks

- A video with 8k exposed as `highres` receives `highres`.
- A video with `hd2160` available and no higher explicit option receives
  `hd2160`.
- YouTube same-tab navigation triggers a new quality attempt.
- Non-watch YouTube pages do not perform quality work.
