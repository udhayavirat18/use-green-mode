import { atom } from 'nanostores';

export const energyScore = atom<number>(100);

const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

export function initGreenObserver() {
  if (!isBrowser) return;

  // Store hardware state internally
  let batteryLevel = 1;
  let isCharging = true;

  // Safe fallback for Firefox/Safari
  const getConnection = () => {
    return (navigator as any).connection || 
           (navigator as any).mozConnection || 
           (navigator as any).webkitConnection || 
           null;
  };

  // 1. Single Source of Truth for Math
  const evaluateScore = () => {
    let score = 100;

    // CPU Penalty
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      score -= 20;
    }

    // Network Penalty
    const conn = getConnection();
    if (conn) {
      if (conn.saveData) score -= 40;
      if (['slow-2g', '2g', '3g'].includes(conn.effectiveType)) score -= 30;
    }

    // Battery Penalty
    if (!isCharging && batteryLevel <= 0.2) {
      score -= 50;
    }

    // Ensure score stays strictly between 0 and 100
    energyScore.set(Math.max(0, Math.min(100, score)));
  };

  // --- 2. Attach Listeners ---

  // Listen for Network Changes (Fixes your DevTools issue!)
  const conn = getConnection();
  if (conn && typeof conn.addEventListener === 'function') {
    conn.addEventListener('change', evaluateScore);
  }

  // Listen for Battery Changes
  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      // Set initial battery state
      batteryLevel = battery.level;
      isCharging = battery.charging;
      evaluateScore();

      // Update state on changes
      battery.addEventListener('levelchange', () => {
        batteryLevel = battery.level;
        evaluateScore();
      });
      battery.addEventListener('chargingchange', () => {
        isCharging = battery.charging;
        evaluateScore();
      });
    }).catch(() => {
      // Failsafe: Some strict browsers block the battery promise
      evaluateScore();
    });
  } else {
    // Failsafe: Safari/Firefox don't support getBattery
    evaluateScore();
  }
}