import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import vm from "node:vm";

const root = join(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
const contentScript = manifest.content_scripts.find(({ matches }) => matches.includes("*://*.youtube.com/*"));

function openYouTube(pathname) {
  const document = new EventTarget();
  const tab = {
    player: null,
    location: { pathname },
    emit: (type) => document.dispatchEvent(new Event(type)),
  };
  document.getElementById = (id) => (id === "movie_player" ? tab.player : null);
  const context = vm.createContext({ location: tab.location, document });
  for (const file of contentScript.js) {
    vm.runInContext(readFileSync(join(root, file), "utf8"), context, { filename: file });
  }
  return tab;
}

function player(levels) {
  return {
    quality: "auto",
    getAvailableQualityLevels: () => levels,
    setPlaybackQualityRange(quality) {
      this.quality = quality;
    },
  };
}

test("a loaded video gets the highest listed quality, with highres above named hd levels", () => {
  const tab = openYouTube("/watch");
  tab.player = player(["hd2160", "hd1080", "highres", "auto"]);

  tab.emit("loadedmetadata");

  assert.equal(tab.player.quality, "highres");
});

test("pages other than watch are left alone", () => {
  const tab = openYouTube("/");
  tab.player = player(["hd2160", "auto"]);

  tab.emit("loadedmetadata");
  tab.emit("yt-navigate-finish");

  assert.equal(tab.player.quality, "auto");
});

test("returning to the watch page upgrades a video that loaded elsewhere", () => {
  const tab = openYouTube("/");
  tab.player = player(["hd1080", "hd720", "auto"]);
  tab.emit("loadedmetadata");

  tab.location.pathname = "/watch";
  tab.emit("yt-navigate-finish");

  assert.equal(tab.player.quality, "hd1080");
});

test("navigation before the player is ready changes nothing", () => {
  const tab = openYouTube("/watch");

  tab.emit("yt-navigate-finish");
  tab.player = { quality: "auto" };
  tab.emit("yt-navigate-finish");

  assert.equal(tab.player.quality, "auto");
});

test("a player without the quality setter waits for a later event", () => {
  const tab = openYouTube("/watch");
  const { setPlaybackQualityRange, ...loadingPlayer } = player(["hd2160", "hd1080", "auto"]);
  tab.player = loadingPlayer;

  tab.emit("yt-navigate-finish");
  tab.emit("loadedmetadata");

  assert.equal(tab.player.quality, "auto");

  tab.player.setPlaybackQualityRange = setPlaybackQualityRange;
  tab.emit("loadedmetadata");

  assert.equal(tab.player.quality, "hd2160");
});

test("a player without a known quality level keeps its quality", () => {
  const tab = openYouTube("/watch");
  tab.player = player(["auto"]);

  tab.emit("loadedmetadata");

  assert.equal(tab.player.quality, "auto");
});
