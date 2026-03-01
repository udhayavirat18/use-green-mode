import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { energyScore, initGreenObserver } from './engine';

interface GreenThresholds {
  lowResAt?: number;
  stopAnimationsAt?: number;
  ecoThemeAt?: number;
}

// Global flag to ensure we only add browser listeners once
let isInitialized = false;

export function useGreenMode(thresholds: GreenThresholds = {}) {
  const { lowResAt = 70, stopAnimationsAt = 50, ecoThemeAt = 30 } = thresholds;
  
  // Read the current score from the Nano Store
  const currentScore = useStore(energyScore);

  useEffect(() => {
    // Only initialize the engine once, even if the hook is used in 10 components
    if (!isInitialized) {
      initGreenObserver();
      isInitialized = true;
    }
  }, []);

  return {
    energyScore: currentScore, // FIXED: Now matches your README exactly!
    lowRes: currentScore <= lowResAt,
    stopAnimations: currentScore <= stopAnimationsAt,
    ecoTheme: currentScore <= ecoThemeAt,
  };
}