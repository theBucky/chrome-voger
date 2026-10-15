// chrome persists this policy across restarts, so applying the setting on install or update is enough.
chrome.runtime.onInstalled.addListener(() => {
  chrome.privacy.network.webRTCIPHandlingPolicy.set({ value: "disable_non_proxied_udp" });
});
