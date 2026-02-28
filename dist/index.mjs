// src/useGreenMode.ts
import { useEffect } from "react";
import { useStore } from "@nanostores/react";

// src/engine.ts
import { atom } from "nanostores";
var energyScore = atom(100);
var isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";
function initGreenObserver() {
  if (!isBrowser) return;
  const calculateScore = () => {
    let score = 100;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) score -= 20;
    const connection = navigator.connection;
    if (connection) {
      if (connection.saveData) score -= 40;
      if (["slow-2g", "2g", "3g"].includes(connection.effectiveType)) score -= 30;
    }
    energyScore.set(Math.max(0, score));
  };
  if ("getBattery" in navigator) {
    navigator.getBattery().then((battery) => {
      const updateBatteryImpact = () => {
        let currentScore = energyScore.get();
        if (!battery.charging && battery.level <= 0.2) {
          energyScore.set(Math.max(0, currentScore - 50));
        } else {
          calculateScore();
        }
      };
      updateBatteryImpact();
      battery.addEventListener("levelchange", updateBatteryImpact);
      battery.addEventListener("chargingchange", updateBatteryImpact);
    });
  } else {
    calculateScore();
  }
}

// src/useGreenMode.ts
function useGreenMode(thresholds = {}) {
  const { lowResAt = 70, stopAnimationsAt = 50, ecoThemeAt = 30 } = thresholds;
  const score = useStore(energyScore);
  useEffect(() => {
    initGreenObserver();
  }, []);
  return {
    score,
    lowRes: score <= lowResAt,
    stopAnimations: score <= stopAnimationsAt,
    ecoTheme: score <= ecoThemeAt
  };
}
export {
  energyScore,
  initGreenObserver,
  useGreenMode
};
