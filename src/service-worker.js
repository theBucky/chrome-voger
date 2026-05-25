function rejectRuntimeError(reject) {
  const error = chrome.runtime.lastError;
  if (error) {
    reject(new Error(error.message));
    return true;
  }

  return false;
}

function getWebRTCPolicy() {
  return new Promise((resolve, reject) => {
    chrome.privacy.network.webRTCIPHandlingPolicy.get({}, (details) => {
      if (!rejectRuntimeError(reject)) {
        resolve(details);
      }
    });
  });
}

function setWebRTCPolicy(value) {
  return new Promise((resolve, reject) => {
    chrome.privacy.network.webRTCIPHandlingPolicy.set({ value }, () => {
      if (!rejectRuntimeError(reject)) {
        resolve();
      }
    });
  });
}

async function applyWebRTCPolicy() {
  const policy = await getWebRTCPolicy();
  const canControl =
    policy.levelOfControl === "controllable_by_this_extension" ||
    policy.levelOfControl === "controlled_by_this_extension";

  if (!canControl) {
    console.warn("WebRTC IP handling policy is not controllable by this extension.");
    return;
  }

  if (policy.value !== "disable_non_proxied_udp") {
    await setWebRTCPolicy("disable_non_proxied_udp");
  }
}

chrome.runtime.onInstalled.addListener(() => {
  applyWebRTCPolicy().catch((error) => {
    console.error("Failed to apply WebRTC policy after install.", error);
  });
});

chrome.runtime.onStartup.addListener(() => {
  applyWebRTCPolicy().catch((error) => {
    console.error("Failed to apply WebRTC policy after startup.", error);
  });
});

applyWebRTCPolicy().catch((error) => {
  console.error("Failed to apply WebRTC policy.", error);
});
