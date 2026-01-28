
import { useEffect, useRef, useCallback, useState } from 'react';

export const useAmbientSounds = (ticketCount = 0, settings) => {
  const audioCtxRef = useRef(null);
  const sizzleNodeRef = useRef(null);
  const sizzleGainRef = useRef(null);
  const masterGainRef = useRef(null);
  const isMutedRef = useRef(false);
  const [isMuted, setIsMutedState] = useState(false);

  // Initialize Audio Context
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      // Master Gain
      masterGainRef.current = audioCtxRef.current.createGain();
      // Apply Master Volume from Settings
      const volume = settings ? (settings.masterVolume / 100) * 0.5 : 0.5;
      masterGainRef.current.gain.value = volume; 
      
      masterGainRef.current.connect(audioCtxRef.current.destination);

      if (settings?.sizzleSounds !== false) {
        startSizzle();
      }
      if (settings?.kitchenClatter !== false) {
        startAmbientClatterLoop();
      }
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, [settings]);

  // Update master volume when settings change
  useEffect(() => {
    if (masterGainRef.current && settings) {
      const volume = (settings.masterVolume / 100) * 0.5;
      masterGainRef.current.gain.setTargetAtTime(
        volume,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  }, [settings?.masterVolume]);

  // Toggle sizzle based on settings
  useEffect(() => {
     if (settings?.sizzleSounds === false) {
       // Stop sizzle
       if (sizzleNodeRef.current) {
         try { sizzleNodeRef.current.stop(); } catch(e) {}
         sizzleNodeRef.current = null;
         sizzleGainRef.current = null;
       }
     } else {
       // Start sizzle if not running and audio active
       if (audioCtxRef.current && !sizzleNodeRef.current) {
         startSizzle();
       }
     }
  }, [settings?.sizzleSounds]);

  // --- SOUND GENERATORS ---

  // 1. Sizzle Loop (White Noise + LowPass Filter)
  const startSizzle = () => {
    if (!audioCtxRef.current || sizzleNodeRef.current) return;

    const ctx = audioCtxRef.current;
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gain = ctx.createGain();
    gain.gain.value = 0.05; // Initial low volume

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    noise.start();
    sizzleNodeRef.current = noise;
    sizzleGainRef.current = gain;
  };

  // 2. Ticket Printer (Sawtooth slide)
  const playTicketSound = useCallback(() => {
    if (settings?.ticketPrinter === false) return;
    if (!audioCtxRef.current || isMutedRef.current) return;
    initAudio(); // Ensure context is running

    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(t);
    osc.stop(t + 0.15);
  }, [initAudio, settings?.ticketPrinter]);

  // 3. Order Ding (Sine with decay)
  const playDingSound = useCallback(() => {
    if (settings?.orderCompleteDing === false) return;
    if (!audioCtxRef.current || isMutedRef.current) return;
    initAudio();

    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(t);
    osc.stop(t + 1.5);
  }, [initAudio, settings?.orderCompleteDing]);

  // 4. Kitchen Clatter (Random noise bursts)
  const playClatter = useCallback(() => {
    if (!audioCtxRef.current || isMutedRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Create a short metallic noise
    const bufferSize = ctx.sampleRate * 0.1; // 0.1s
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() - 0.5) * 0.5; // Quieter noise
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    const gain = ctx.createGain();
    gain.gain.value = 0.05;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);
    
    noise.start();
  }, []);

  const startAmbientClatterLoop = () => {
      // Setup a random interval loop for clatter
      const loop = () => {
          if(!isMutedRef.current && Math.random() > 0.6) {
             // We check setting here in real time in loop
             // We can't access updated settings directly in closure unless ref
             // But for now we just let it try, and rely on playClatter? 
             // Hooks are tricky with intervals.
             // Simplification: just play random sounds.
             // Ideally we'd check settings ref here.
             // For now, let's just assume if it started it runs, unless muted.
          }
          // The interval is messy in React if dependencies change.
          // For this exercise, simplified ambient loop:
      };
      
      // Better approach for React:
      // We rely on useEffect interval below
  };

  useEffect(() => {
      if (settings?.kitchenClatter === false) return;

      const interval = setInterval(() => {
          if (!isMutedRef.current && Math.random() > 0.7) {
              playClatter();
          }
      }, 4000);

      return () => clearInterval(interval);
  }, [settings?.kitchenClatter, playClatter]);


  // --- CONTROLS ---

  const muteAll = useCallback(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
    }
    isMutedRef.current = true;
    setIsMutedState(true);
  }, []);

  const unmuteAll = useCallback(() => {
    if (masterGainRef.current) {
      const vol = settings ? (settings.masterVolume / 100) * 0.5 : 0.5;
      masterGainRef.current.gain.setTargetAtTime(vol, audioCtxRef.current.currentTime, 0.1);
    }
    isMutedRef.current = false;
    setIsMutedState(false);
    initAudio(); // Try to resume if it was suspended
  }, [initAudio, settings]);

  const toggleMute = useCallback(() => {
    if (isMutedRef.current) unmuteAll();
    else muteAll();
  }, [muteAll, unmuteAll]);

  // --- EFFECTS ---

  // Adjust sizzle volume based on tickets
  useEffect(() => {
    if (sizzleGainRef.current && audioCtxRef.current) {
      const baseVol = 0.02;
      // Cap max volume at 10 tickets
      const intensity = Math.min(ticketCount, 10) / 10; 
      const newVol = baseVol + (intensity * 0.15); 
      
      sizzleGainRef.current.gain.setTargetAtTime(
        newVol, 
        audioCtxRef.current.currentTime, 
        1.0 // Ramp over 1s
      );
    }
  }, [ticketCount]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  return {
    playTicketSound,
    playDingSound,
    toggleMute,
    isMuted,
    initAudio
  };
};
