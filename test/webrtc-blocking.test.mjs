import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import vm from "node:vm";

const root = join(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));

function run(files, globals) {
  const context = vm.createContext(globals);
  vm.runInContext("globalThis.window = globalThis;", context);
  for (const file of files) {
    vm.runInContext(readFileSync(join(root, file), "utf8"), context, { filename: file });
  }
  return context;
}

function loadPage(globals) {
  const entry = manifest.content_scripts.find(({ matches }) => matches.includes("<all_urls>"));
  return run(entry.js, { DOMException, ...globals });
}

test("install sets the WebRTC IP handling policy to disable non-proxied UDP", () => {
  const installListeners = [];
  const policy = { value: "default", set: ({ value }) => (policy.value = value) };
  run([manifest.background.service_worker], {
    chrome: {
      runtime: { onInstalled: { addListener: (listener) => installListeners.push(listener) } },
      privacy: { network: { webRTCIPHandlingPolicy: policy } },
    },
  });

  installListeners.forEach((listener) => listener({ reason: "install" }));

  assert.equal(policy.value, "disable_non_proxied_udp");
});

test("page code cannot construct a peer connection", () => {
  class RTCPeerConnection {}
  const window = loadPage({ RTCPeerConnection, webkitRTCPeerConnection: RTCPeerConnection });

  for (const name of ["RTCPeerConnection", "webkitRTCPeerConnection"]) {
    assert.throws(() => vm.runInContext(`new ${name}()`, window), { name: "SecurityError" });
  }
});

test("page code cannot restore the original constructor", () => {
  class RTCPeerConnection {}
  const window = loadPage({ RTCPeerConnection });

  vm.runInContext('"use strict"; window.RTCPeerConnection = function Polyfill() {};', window);
  assert.equal(vm.runInContext("delete window.RTCPeerConnection", window), false);
  assert.throws(() => vm.runInContext("Object.defineProperty(window, 'RTCPeerConnection', { value: 1 })", window), { name: "TypeError" });
  assert.throws(() => vm.runInContext("new RTCPeerConnection()", window), { name: "SecurityError" });
});

test("pages without WebRTC stay without WebRTC", () => {
  const window = loadPage({});

  assert.equal("RTCPeerConnection" in window, false);
  assert.equal("webkitRTCPeerConnection" in window, false);
});
