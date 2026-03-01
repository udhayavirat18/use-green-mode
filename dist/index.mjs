// src/useGreenMode.ts
import { useEffect } from "react";
import { useStore } from "@nanostores/react";

// src/engine.ts
import { atom } from "nanostores";
var energyScore = atom(100);
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
  const currentScore = useStore(energyScore);
  useEffect(() => {
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
export {
  energyScore,
  initGreenObserver,
  useGreenMode
};
