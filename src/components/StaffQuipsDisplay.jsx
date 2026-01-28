
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { STAFF_BIOS } from '@/data/contentArrays';

const StaffQuipsDisplay = ({ pendingTicketCount }) => {
  const { gameStatus, shiftPhase, ticketsServed } = useGame();
  const [currentQuip, setCurrentQuip] = useState(null);
  const timerRef = useRef(null);
  const prevTicketsServed = useRef(ticketsServed);

  // Helper to get a random item from array
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Helper to trigger a quip
  const triggerQuip = (type = 'normal') => {
    // If we aren't in active service, don't show quips
    if (gameStatus !== 'playing' || shiftPhase !== 'Service') return;

    // Pick a random staff member
    const staff = getRandom(STAFF_BIOS);
    if (!staff) return;

    let text = "";

    if (type === 'stress') {
      const stressPhrases = [
        "We're drowning here!",
        "Pick up, pick up!",
        "All hands on deck!",
        "I need a runner NOW!",
        "Ticket machine won't stop!",
        "Who's watching the pass?!",
        "Behind! Hot! Move!",
        "Where is my garnish?!"
      ];
      text = getRandom(stressPhrases);
    } else if (type === 'success') {
      const successPhrases = [
        "Beautiful plating!",
        "That's money!",
        "One down, fifty to go!",
        "Service please!",
        "Selling table 4!",
        "Walking in!",
        "Perfect temp, Chef.",
        "Smooth service."
      ];
      text = getRandom(successPhrases);
    } else {
      // Normal personality quip
      text = getRandom(staff.quips);
    }

    setCurrentQuip({
      id: Date.now(),
      name: staff.name,
      role: staff.role,
      text: text,
      type: type
    });

    // Auto clear after 3 seconds
    setTimeout(() => {
      setCurrentQuip(null);
    }, 3500);
  };

  // Effect: Random ambient quips loop
  useEffect(() => {
    if (gameStatus !== 'playing' || shiftPhase !== 'Service') {
      setCurrentQuip(null);
      return;
    }

    const scheduleNextQuip = () => {
      // Random delay between 8 and 15 seconds
      const delay = Math.floor(Math.random() * (15000 - 8000 + 1) + 8000);
      
      timerRef.current = setTimeout(() => {
        // Determine type based on game state
        let type = 'normal';
        if (pendingTicketCount > 5) {
          // 70% chance of stress quip if queue is long
          if (Math.random() < 0.7) type = 'stress';
        }

        triggerQuip(type);
        scheduleNextQuip(); // Recursively schedule next
      }, delay);
    };

    scheduleNextQuip();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameStatus, shiftPhase, pendingTicketCount]);

  // Effect: React to successful service (Celebration quips)
  useEffect(() => {
    if (ticketsServed > prevTicketsServed.current) {
      // 30% chance to celebrate a served ticket
      if (Math.random() < 0.3) {
        if (timerRef.current) clearTimeout(timerRef.current); // Reset ambient timer
        triggerQuip('success');
      }
    }
    prevTicketsServed.current = ticketsServed;
  }, [ticketsServed]);

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 pointer-events-none z-50 w-full max-w-lg flex justify-center">
      <AnimatePresence mode="wait">
        {currentQuip && (
          <motion.div
            key={currentQuip.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`
              relative px-6 py-3 rounded-full shadow-xl backdrop-blur-md border
              flex items-center gap-3
              ${currentQuip.type === 'stress' 
                ? 'bg-red-900/80 border-red-500/50 text-red-100' 
                : currentQuip.type === 'success'
                ? 'bg-green-900/80 border-green-500/50 text-green-100'
                : 'bg-slate-900/80 border-slate-700/50 text-slate-200'
              }
            `}
          >
            <div className="flex flex-col text-right border-r pr-3 border-white/20">
              <span className="text-xs font-bold uppercase tracking-wider">{currentQuip.name}</span>
              <span className="text-[10px] opacity-70 italic">{currentQuip.role}</span>
            </div>
            <div className="text-sm font-medium italic">
              "{currentQuip.text}"
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffQuipsDisplay;
