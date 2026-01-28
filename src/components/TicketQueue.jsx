
import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { getRecipeById } from '@/data/recipes';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

const TicketQueue = ({ onNewTicket, tickets = [] }) => {
  const {
    gameStatus,
    currentPhase,
    shiftPhase,
    currentBookingDifficulty,
    selectedMenu,
    getAverageStaffSpeed
  } = useGame();

  const intervalRef = useRef(null);

  // Determine ticket generation interval based on difficulty and staff speed
  const getInterval = () => {
    let baseInterval = 8000; // Default 8 seconds

    // Phase modifier
    if (currentPhase === 'Mid Service') baseInterval = 5000;
    if (currentPhase === 'Dinner Rush') baseInterval = 3000;

    // Difficulty modifier
    if (currentBookingDifficulty === 'Easy') baseInterval *= 1.2;
    if (currentBookingDifficulty === 'Hard') baseInterval *= 0.8;

    // Staff Speed Modifier (Safe Access)
    const avgSpeed = getAverageStaffSpeed ? getAverageStaffSpeed() : 1;
    const reduction = (avgSpeed - 1) * 0.05;

    const finalInterval = Math.max(2000, baseInterval * (1 - reduction)); // Cap at 2s minimum
    return finalInterval;
  };

  // Logging Effect for Debugging State
  useEffect(() => {
    if (shiftPhase === 'Service') {
      console.log(`[TicketQueue] Service Active. Status: ${gameStatus}`);
      console.log(`[TicketQueue] Selected Menu:`, selectedMenu);
      
      if (!selectedMenu || selectedMenu.length === 0) {
        console.warn(`[TicketQueue] WARNING: selectedMenu is empty! Using fallback.`);
      }
    }
  }, [shiftPhase, gameStatus, selectedMenu]);
useEffect(() => {
  // 1. Guard: Only spawn if playing and in Service
  if (gameStatus !== 'playing' || shiftPhase !== 'Service') {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return;
  }

  // 2. Prevent double-intervals if dependencies trigger re-render
  if (intervalRef.current) return; 

  const spawnTicket = () => {
    const activeMenu = (selectedMenu && selectedMenu.length > 0) ? selectedMenu : [1, 2, 3, 4, 5, 6, 7];
    const randomId = activeMenu[Math.floor(Math.random() * activeMenu.length)];
    const recipe = getRecipeById(randomId);

    if (recipe) {
      onNewTicket({ ...recipe, uniqueId: Date.now() + Math.random() });
    }
  };

  // 3. The "Kickstart": Spawn one ticket immediately so the player isn't waiting
  spawnTicket(); 

  const calculatedInterval = getInterval();
  intervalRef.current = setInterval(spawnTicket, calculatedInterval);

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  // ONLY listen to the core status toggles to avoid reset-loops
}, [gameStatus, shiftPhase]);

  // VISUAL RENDER OF QUEUE
  return (
    <div className="fixed top-24 right-4 z-30 w-64 pointer-events-none flex flex-col gap-2">
      <AnimatePresence>
        {tickets.map((ticket, index) => (
          <motion.div
            key={ticket.uniqueId}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white border-l-4 border-yellow-500 shadow-lg rounded-r-md p-3 relative pointer-events-auto"
          >
            {index === 0 && (
               <div className="absolute -left-1 top-0 bottom-0 w-1 bg-green-500 animate-pulse" />
            )}
            <div className="flex justify-between items-start mb-1">
               <span className="font-bold text-slate-800 text-sm truncate pr-2">{ticket.name}</span>
               <span className="text-[10px] bg-slate-200 px-1 rounded text-slate-600 font-mono">#{ticket.id}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
               <div className="flex items-center gap-1">
                 <Clock size={12} />
                 <span>{ticket.prepTime}s</span>
               </div>
               <div className="flex items-center gap-1">
                  {ticket.difficulty === 'Complex' && <AlertTriangle size={12} className="text-red-500" />}
                  <span className={ticket.difficulty === 'Complex' ? 'text-red-500 font-bold' : ''}>
                    {ticket.difficulty || 'Normal'}
                  </span>
               </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TicketQueue;
