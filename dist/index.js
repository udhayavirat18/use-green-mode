"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  energyScore: () => energyScore,
  initGreenObserver: () => initGreenObserver,
  useGreenMode: () => useGreenMode
});
module.exports = __toCommonJS(index_exports);

// src/useGreenMode.ts
var import_react = require("react");
var import_react2 = require("@nanostores/react");

// src/engine.ts
var import_nanostores = require("nanostores");
var energyScore = (0, import_nanostores.atom)(100);
var isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";
function initGreenObserver() {
  if (!isBrowser) return;
  let batteryLevel = 1;
  let isCharging = true;
  const getConnection = () => {
    return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  };
  const evaluateScore = () => {
    let score = 100;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      score -= 20;
    }
    const conn2 = getConnection();
    if (conn2) {
      if (conn2.saveData) score -= 40;
      if (["slow-2g", "2g", "3g"].includes(conn2.effectiveType)) score -= 30;
    }
    if (!isCharging && batteryLevel <= 0.2) {
      score -= 50;
    }
    energyScore.set(Math.max(0, Math.min(100, score)));
  };
  const conn = getConnection();
  if (conn && typeof conn.addEventListener === "function") {
    conn.addEventListener("change", evaluateScore);
  }
  if ("getBattery" in navigator) {
    navigator.getBattery().then((battery) => {
      batteryLevel = battery.level;
      isCharging = battery.charging;
      evaluateScore();
      battery.addEventListener("levelchange", () => {
        batteryLevel = battery.level;
        evaluateScore();
      });
      battery.addEventListener("chargingchange", () => {
        isCharging = battery.charging;
        evaluateScore();
      });
    }).catch(() => {
      evaluateScore();
    });
  } else {
    evaluateScore();
  }
}

// src/useGreenMode.ts
var isInitialized = false;
function useGreenMode(thresholds = {}) {
  const { lowResAt = 70, stopAnimationsAt = 50, ecoThemeAt = 30 } = thresholds;
  const currentScore = (0, import_react2.useStore)(energyScore);
  (0, import_react.useEffect)(() => {
    if (!isInitialized) {
      initGreenObserver();
      isInitialized = true;
    }
  }, []);
  return {
    energyScore: currentScore,
    // FIXED: Now matches your README exactly!
    lowRes: currentScore <= lowResAt,
    stopAnimations: currentScore <= stopAnimationsAt,
    ecoTheme: currentScore <= ecoThemeAt
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  energyScore,
  initGreenObserver,
  useGreenMode
});
