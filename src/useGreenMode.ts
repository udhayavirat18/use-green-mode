import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { energyScore, initGreenObserver } from './engine';

interface GreenThresholds {
  lowResAt?: number;
  stopAnimationsAt?: number;
  ecoThemeAt?: number;
}

export function useGreenMode(thresholds: GreenThresholds = {}) {
  const { lowResAt = 70, stopAnimationsAt = 50, ecoThemeAt = 30 } = thresholds;
  const score = useStore(energyScore);

  useEffect(() => {
    initGreenObserver();
  }, []);

  return {
    score,
    lowRes: score <= lowResAt,
    stopAnimations: score <= stopAnimationsAt,
    ecoTheme: score <= ecoThemeAt,
  };
}