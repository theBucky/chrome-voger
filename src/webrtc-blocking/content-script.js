for (const name of ["RTCPeerConnection", "webkitRTCPeerConnection"]) {
  if (!(name in window)) {
    continue;
  }

  const blocked = function () {
    throw new DOMException(`${name} is blocked by Chrome Voger.`, "SecurityError");
  };

  // ignore polyfill assignments without allowing the original constructor to be restored.
  Object.defineProperty(window, name, { configurable: false, get: () => blocked, set() {} });
}
