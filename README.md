# 🌿 use-green-mode

A lightweight, eco-friendly React hook that gracefully degrades your UI to save battery and data. 

Modern web apps are heavy. When a user's device is dying or their connection drops, running 60fps animations and loading 4K images drains their battery faster. `use-green-mode` watches native browser APIs and gives you a simple set of boolean flags to turn off the heavy stuff when your users need it most.

## ✨ Features
* **Zero React Context:** Powered by an independent Vanilla JS engine (Nano Stores).
* **Event-Driven:** Listens to the Battery Status API instead of expensive polling.
* **Network Aware:** Detects `Save-Data` headers and 2G/3G connections.
* **CPU Aware:** Checks `hardwareConcurrency` for low-end devices.
* **Tiny & Fast:** Built with `tsup` for maximum tree-shaking.

## 📦 Installation

```bash
npm install use-green-mode
# or
yarn add use-green-mode
```
# 🚀 Quick Start

Drop `useGreenMode` into your top-level component. It automatically calculates an `energyScore` (0 to 100) and toggles features based on safe defaults.

```
import { useGreenMode } from 'use-green-mode';
import { motion } from 'framer-motion';

export function App() {
  const { lowRes, stopAnimations, ecoTheme } = useGreenMode();

  return (
    <div className={ecoTheme ? 'theme-dark-high-contrast' : 'theme-standard'}>
      {/* 1. Serve smaller images when data/battery is low */}
      <img 
        src={lowRes ? '/hero-tiny.jpg' : '/hero-4k.jpg'} 
        alt="Hero Background" 
      />

      {/* 2. Kill heavy animations to save CPU/Battery */}
      {!stopAnimations && (
        <motion.div animate={{ rotate: 360 }} />
      )}
    </div>
  );
}
```
# ⚙️ Customization

You can pass custom thresholds to define exactly when your app goes into "survival mode."

```
const { stopAnimations, ecoTheme } = useGreenMode({
  lowResAt: 80,         // Trigger earlier
  stopAnimationsAt: 50, // Default
  ecoThemeAt: 15        // Only on extreme low battery
});
```

# 🛠️ Vanilla JS Usage

Not using React? You can use the core engine directly anywhere in your JavaScript.

```
import { energyScore, initGreenObserver } from 'use-green-mode/engine';

initGreenObserver();

energyScore.subscribe((score) => {
  if (score < 50) {
    document.body.classList.add('stop-animations');
  }
});
```