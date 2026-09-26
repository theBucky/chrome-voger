(() => {
  // YouTube can label an 8k stream "highres", so that label outranks the named hd levels.
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
      // Equal minimum and maximum pin the player to one quality.
      player.setPlaybackQualityRange(quality, quality);
    }
  }

  // loadedmetadata fires for each new video source, including ads. yt-navigate-finish covers
  // a video that loaded in the miniplayer before the tab returned to the watch page.
  document.addEventListener("loadedmetadata", applyBestQuality, true);
  document.addEventListener("yt-navigate-finish", applyBestQuality);
})();
