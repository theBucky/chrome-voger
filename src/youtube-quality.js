(() => {
  "use strict";

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

  const RETRY_DELAYS_MS = [100, 250, 500, 1000, 1500, 2000, 2500, 3000];
  const RECHECK_DELAYS_MS = [1500, 4000, 8000];

  let retryTimer = 0;

  function isWatchPage() {
    return location.hostname.endsWith("youtube.com") && location.pathname === "/watch";
  }

  function getPlayer() {
    return document.querySelector(".html5-video-player");
  }

  function getAvailableQualities(player) {
    if (typeof player.getAvailableQualityLevels !== "function") {
      return [];
    }

    const levels = player.getAvailableQualityLevels();
    if (!Array.isArray(levels)) {
      return [];
    }

    return levels.filter((level) => typeof level === "string" && level.length > 0);
  }

  function getBestQuality(qualities) {
    for (const quality of QUALITY_PRIORITY) {
      if (qualities.includes(quality)) {
        return quality;
      }
    }

    return qualities[0] || "";
  }

  function setQualityWithPlayerApi(player, quality) {
    let changed = false;

    if (typeof player.setPlaybackQualityRange === "function") {
      player.setPlaybackQualityRange(quality);
      changed = true;
    }

    if (typeof player.setPlaybackQuality === "function") {
      player.setPlaybackQuality(quality);
      changed = true;
    }

    return changed;
  }

  function trySetHighestQuality() {
    if (!isWatchPage()) {
      return false;
    }

    const player = getPlayer();
    if (!player) {
      return false;
    }

    const qualities = getAvailableQualities(player);
    const bestQuality = getBestQuality(qualities);
    if (!bestQuality) {
      return false;
    }

    return setQualityWithPlayerApi(player, bestQuality);
  }

  function scheduleRechecks() {
    for (const delay of RECHECK_DELAYS_MS) {
      window.setTimeout(() => {
        trySetHighestQuality();
      }, delay);
    }
  }

  function scheduleAttempt(attempt) {
    window.clearTimeout(retryTimer);

    retryTimer = window.setTimeout(() => {
      const success = trySetHighestQuality();
      if (success) {
        scheduleRechecks();
        return;
      }

      if (attempt + 1 >= RETRY_DELAYS_MS.length) {
        console.warn("Chrome Voger could not set YouTube quality.");
        return;
      }

      scheduleAttempt(attempt + 1);
    }, RETRY_DELAYS_MS[attempt]);
  }

  function handleNavigation() {
    if (!isWatchPage()) {
      return;
    }

    scheduleAttempt(0);
  }

  document.addEventListener("yt-navigate-finish", handleNavigation);
  document.addEventListener("DOMContentLoaded", handleNavigation, { once: true });
  document.addEventListener(
    "loadedmetadata",
    (event) => {
      if (isWatchPage() && event.target instanceof HTMLVideoElement) {
        scheduleAttempt(0);
      }
    },
    true,
  );

  handleNavigation();
})();
