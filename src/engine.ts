import { atom } from 'nanostores';

export const energyScore = atom<number>(100);

const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

export function initGreenObserver() {
  if (!isBrowser) return;

  const calculateScore = () => {
    let score = 100;
    
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) score -= 20;

    const connection = (navigator as any).connection;
    if (connection) {
      if (connection.saveData) score -= 40;
      if (['slow-2g', '2g', '3g'].includes(connection.effectiveType)) score -= 30;
    }

    energyScore.set(Math.max(0, score));
  };

  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      const updateBatteryImpact = () => {
        let currentScore = energyScore.get();
        if (!battery.charging && battery.level <= 0.2) {
          energyScore.set(Math.max(0, currentScore - 50));
        } else {
          calculateScore();
        }
      };

      updateBatteryImpact();
      battery.addEventListener('levelchange', updateBatteryImpact);
      battery.addEventListener('chargingchange', updateBatteryImpact);
    });
  } else {
    calculateScore();
  }
}