// RTCDataChannel needs no stub: page code can only get a data channel from a peer connection.
for (const name of ["RTCPeerConnection", "webkitRTCPeerConnection"]) {
  if (!(name in window)) {
    continue;
  }

  const blocked = function () {
    throw new DOMException(`${name} is blocked by Chrome Voger.`, "SecurityError");
  };

  // Non-configurable so page code cannot restore the original; the no-op setter
  // lets polyfill assignments such as `window.RTCPeerConnection = ...` pass without throwing.
  Object.defineProperty(window, name, { configurable: false, get: () => blocked, set() {} });
}
