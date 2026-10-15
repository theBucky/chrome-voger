(() => {
  // youtube labels some 8k streams "highres".
  const QUALITY_PRIORITY = [
    "highres",
    "hd4320",
    "hd2880",
    "hd2160",
    "hd1440",
    "hd1080",
    "hd720",
    "large",
    "medium",
    "small",
    "tiny",
  ];

  function applyBestQuality() {
    if (location.pathname !== "/watch") {
      return;
    }

    const player = document.getElementById("movie_player");
    const levels = player?.getAvailableQualityLevels?.();
    const quality = QUALITY_PRIORITY.find((level) => levels?.includes(level));
    if (quality) {
      player.setPlaybackQualityRange?.(quality, quality);
    }
  }

  // loadedmetadata covers new sources and ads; yt-navigate-finish covers returning from the miniplayer.
  document.addEventListener("loadedmetadata", applyBestQuality, true);
  document.addEventListener("yt-navigate-finish", applyBestQuality);
})();
