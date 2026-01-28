
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGame } from '@/contexts/GameContext';
import GameHUD from './GameHUD';
import DishCard from './DishCard';
import TicketQueue from './TicketQueue';
import GameLogic from './GameLogic';
import GameOver from './GameOver';
import PreShiftScreen from './PreShiftScreen';
import ShiftSummaryScreen from './ShiftSummaryScreen';
import StaffQuipsDisplay from './StaffQuipsDisplay';
import { generateDish, evaluateDish } from '@/utils/dishGenerator';
import { Toaster } from './ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';

// HOOKS & LOGIC
import { useAmbientSounds } from '@/hooks/useAmbientSounds';
import { useScreenShake } from '@/hooks/useScreenShake';
import { gradeService, getSousChefNote, calculateProfit } from '@/data/serviceLogGradeSystem';

const Game = ({ onReturnToTitle }) => {
  const { 
    gameStatus, 
    currentPhase, 
    shiftPhase,
    setShiftPhase,
    incrementServiceTime, 
    careerStats,
    getAverageStaffSkill,
    addServiceLogEntry,
    serviceTime,
    userSettings // Get Settings
  } = useGame();

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [currentDish, setCurrentDish] = useState(null);
  const [pendingTickets, setPendingTickets] = useState([]);
  
  // Tracking for Grade System
  const [ticketStartTime, setTicketStartTime] = useState(0);
  const [ticketFailures, setTicketFailures] = useState(0);

  // Initialize Audio & Shake Hooks (Pass Settings to Audio)
  const { playTicketSound, playDingSound, initAudio } = useAmbientSounds(pendingTickets.length, userSettings);
  const { shakeControls, triggerShake } = useScreenShake();

  // Handle first interaction to unlock audio context
  useEffect(() => {
    const unlockAudio = () => initAudio();
    window.addEventListener('click', unlockAudio, { once: true });
    return () => window.removeEventListener('click', unlockAudio);
  }, [initAudio]);

  const gameLogic = GameLogic({
    currentRecipe,
    currentDish,
    onComplete: () => {
      // Audio Feedback
      playDingSound();
      
      // Move to next ticket
      if (pendingTickets.length > 0) {
        const nextTicket = pendingTickets[0];
        setPendingTickets(prev => prev.slice(1));
        processTicket(nextTicket);
      } else {
        setCurrentRecipe(null);
        setCurrentDish(null);
      }
    }
  });
  
  // --- INTERCEPT LOGIC FOR GRADING ---
  const handleServiceIntercept = () => {
    if (currentDish && currentRecipe) {
      // 1. Calculate accuracy (Pass Settings)
      const evalResult = evaluateDish(currentDish, currentRecipe, userSettings.accuracyRequirement);
      const accuracy = evalResult.normalizedScore;
      
      // 2. Calculate time
      const prepTime = serviceTime - ticketStartTime;
      // Apply Prep Time Multiplier
      const targetTime = (currentRecipe.prepTime || 20) * (userSettings.prepTimeMultiplier || 1);

      // 3. Grade (Determine difficulty for thresholds)
      let difficulty = 'normal';
      if (userSettings.accuracyRequirement < 80) difficulty = 'easy';
      if (userSettings.accuracyRequirement > 90) difficulty = 'hard';

      const grade = gradeService(accuracy, prepTime, targetTime, ticketFailures, difficulty);
      
      // 4. Profit
      const profit = calculateProfit(currentRecipe.baseCost, accuracy, grade, ticketFailures);
      
      // 5. Note
      const note = getSousChefNote(grade, currentRecipe.name);
      
      // 6. Log it
      addServiceLogEntry(currentRecipe.name, grade, profit, note, serviceTime);
    }
    
    // Call original handler
    gameLogic.handleService();
  };

  const handleRejectIntercept = () => {
    setTicketFailures(prev => prev + 1);
    gameLogic.handleReject();
  };

  // Timer
  useEffect(() => {
    if (gameStatus !== 'playing' || shiftPhase !== 'Service') return;

    const timer = setInterval(() => {
      incrementServiceTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, shiftPhase, incrementServiceTime]);

  const handleNewTicket = (recipe) => {
    console.log("Game: New Ticket Received", recipe);
    
    playTicketSound();
    
    // Shake logic based on queue size (Check Visual Effects Setting)
    if (userSettings.visualEffects) {
      if (pendingTickets.length >= 10) triggerShake('large');
      else if (pendingTickets.length >= 5) triggerShake('medium');
      else triggerShake('small');
    }

    if (!currentRecipe) {
      processTicket(recipe);
    } else {
      setPendingTickets(prev => [...prev, recipe]);
    }
  };

  const processTicket = (recipe) => {
    setCurrentRecipe(recipe);
    // Reset ticket tracking
    setTicketStartTime(serviceTime); 
    setTicketFailures(0);

    const avgSkill = getAverageStaffSkill ? getAverageStaffSkill() : 1;
    const dish = generateDish(recipe, currentPhase, avgSkill);
    setCurrentDish(dish);
  };

  const handleRestart = () => {
    console.log("Game: Restarting shift");
    setShiftPhase('PreShift');
    setCurrentRecipe(null);
    setCurrentDish(null);
    setPendingTickets([]);
  };

  // Safe fallback for career stats display
  const currentShift = careerStats?.currentShiftNumber || 1;

  // --- RENDER LOGIC BASED ON PHASE ---

  // 1. Post Shift
  if (shiftPhase === 'PostShift') {
    return (
      <>
        <Helmet>
          <title>The Pass | Shift Summary</title>
          <meta name="description" content="Review your service performance." />
        </Helmet>
        <ShiftSummaryScreen />
      </>
    );
  }

  // 2. Pre Shift
  if (shiftPhase === 'PreShift') {
    return (
      <>
        <Helmet>
          <title>The Pass | Pre-Shift</title>
          <meta name="description" content="Prepare for the next service shift." />
        </Helmet>
        <PreShiftScreen />
      </>
    );
  }

  // 3. Game Over (Fired)
  if (gameStatus === 'fired') {
    return <GameOver onRestart={handleRestart} onReturnToTitle={onReturnToTitle} />;
  }

  // Calculate background color based on stress
  const getBackgroundColor = () => {
     // Respect visual effects for background color shifting
     if (!userSettings.visualEffects) return 'from-gray-900 via-gray-800 to-black';

     if (pendingTickets.length >= 8) return 'from-red-900 via-gray-900 to-black';
     if (pendingTickets.length >= 4) return 'from-orange-900/50 via-gray-800 to-black';
     return 'from-gray-900 via-gray-800 to-black';
  };

  // 4. Service (Main Gameplay)
  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundColor()} relative transition-colors duration-1000 overflow-hidden`}>
      <Helmet>
        <title>{`The Pass | Day ${currentShift}`}</title>
      </Helmet>

      <GameHUD 
        onDebugAddTicket={handleNewTicket} 
        pendingTicketCount={pendingTickets.length}
      />

      <motion.div 
        animate={shakeControls}
        className="container mx-auto p-4 md:p-8 relative z-10"
      >
        {/* Pending Tickets Indicator */}
        <AnimatePresence>
          {pendingTickets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 text-center"
            >
              <div className={`
                inline-block px-6 py-2 rounded-full font-bold shadow-lg border
                ${pendingTickets.length >= 8 && userSettings.visualEffects
                   ? 'bg-red-600 border-red-400 animate-pulse text-white' 
                   : 'bg-yellow-600 border-yellow-400 text-white'}
              `}>
                🔔 {pendingTickets.length} Ticket{pendingTickets.length > 1 ? 's' : ''} Pending
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Game Area */}
        <div className="flex justify-center items-center min-h-[600px]">
          <AnimatePresence mode="wait">
            {currentRecipe && currentDish ? (
              <DishCard
                key={currentRecipe.uniqueId || currentRecipe.id}
                recipe={currentRecipe}
                dish={currentDish}
                onService={handleServiceIntercept} // Use intercepted handler
                onReject={handleRejectIntercept} // Use intercepted handler
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-400 text-xl flex flex-col items-center"
              >
                <div className="text-6xl mb-4 animate-bounce">🔪</div>
                <p>Chef is preparing next dish...</p>
                <p className="text-sm mt-2 text-gray-600">Service Phase: {currentPhase}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <StaffQuipsDisplay pendingTicketCount={pendingTickets.length} />
      <TicketQueue onNewTicket={handleNewTicket} tickets={pendingTickets} />
      <Toaster />
    </div>
  );
};

export default Game;
