import * as nanostores from 'nanostores';

interface GreenThresholds {
    lowResAt?: number;
    stopAnimationsAt?: number;
    ecoThemeAt?: number;
}
declare function useGreenMode(thresholds?: GreenThresholds): {
    score: number;
    lowRes: boolean;
    stopAnimations: boolean;
    ecoTheme: boolean;
};

declare const energyScore: nanostores.PreinitializedWritableAtom<number> & object;
declare function initGreenObserver(): void;

export { energyScore, initGreenObserver, useGreenMode };
