// Chrome persists this extension-controlled value across restarts and applies it
// whenever no higher-precedence controller (enterprise policy or a later-installed
// extension) holds the setting, so setting it on install is enough.
chrome.runtime.onInstalled.addListener(() => {
  chrome.privacy.network.webRTCIPHandlingPolicy.set({ value: "disable_non_proxied_udp" });
});
