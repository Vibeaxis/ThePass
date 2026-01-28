
import { useAnimation } from 'framer-motion';
import { useCallback } from 'react';

export const useScreenShake = () => {
  const controls = useAnimation();

  const triggerShake = useCallback(async (intensity = 'small') => {
    let offset = 2;
    let duration = 0.1;
    let count = 2;

    switch (intensity) {
      case 'medium':
        offset = 5;
        duration = 0.15;
        count = 4;
        break;
      case 'large':
        offset = 8;
        duration = 0.2;
        count = 6;
        break;
      default: // small
        offset = 2;
        duration = 0.1;
        count = 2;
    }

    // Generate keyframes for random shake
    const keyframes = [0];
    for (let i = 0; i < count; i++) {
       keyframes.push(Math.random() * offset * (Math.random() > 0.5 ? 1 : -1));
       keyframes.push(Math.random() * offset * (Math.random() > 0.5 ? 1 : -1));
    }
    keyframes.push(0);

    await controls.start({
      x: keyframes,
      y: keyframes.map(v => v * 0.5), // Less vertical shake
      transition: { duration: duration }
    });
  }, [controls]);

  return {
    shakeControls: controls,
    triggerShake
  };
};
