import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import vm from "node:vm";

const root = join(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
const entry = manifest.content_scripts.find(({ matches }) => matches.includes("*://*.youtube.com/*"));

// A YouTube tab at `pathname`, with the content script loaded and no player yet.
function openYouTube(pathname) {
  const listeners = new Map();
  const tab = {
    player: null,
    location: { pathname },
    emit: (type) => listeners.get(type)?.forEach((listener) => listener({ type })),
  };
  const context = vm.createContext({
    location: tab.location,
    document: {
      addEventListener: (type, listener) => listeners.set(type, [...(listeners.get(type) ?? []), listener]),
      getElementById: (id) => (id === "movie_player" ? tab.player : null),
    },
  });
  for (const file of entry.js) {
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

test("a player without a known quality level keeps its quality", () => {
  const tab = openYouTube("/watch");
  tab.player = player(["auto"]);

  tab.emit("loadedmetadata");

  assert.equal(tab.player.quality, "auto");
});
