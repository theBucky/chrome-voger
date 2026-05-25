(() => {
  "use strict";

  const blockedNames = ["RTCPeerConnection", "webkitRTCPeerConnection", "RTCDataChannel"];

  function blockConstructor(name) {
    if (!(name in window)) {
      return;
    }

    const blockedConstructor = function blockedWebRTCConstructor() {
      throw new DOMException(`${name} is blocked by Chrome Voger.`, "SecurityError");
    };

    Object.defineProperty(window, name, {
      configurable: false,
      enumerable: true,
      get() {
        return blockedConstructor;
      },
      set() {},
    });
  }

  for (const name of blockedNames) {
    blockConstructor(name);
  }
})();
