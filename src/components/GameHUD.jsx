
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, DollarSign, ClipboardList, Clock, 
  Award, Bug, Flame, List, Settings
} from 'lucide-react';
import StaffManagementModal from './StaffManagementModal';
import MenuLoadoutModal from './MenuLoadoutModal';
import ServiceLogDisplay from './ServiceLogDisplay';
import SettingsPanel from './SettingsPanel';
import { getRecipeById } from '@/data/recipes';

const GameHUD = ({ onDebugAddTicket, pendingTicketCount = 0 }) => {
  const {
    reputation,
    money,
    ticketsServed,
    totalTickets,
    serviceTime,
    currentPhase,
    shiftPhase,
    selectedMenu,
    gameStatus,
    userSettings
  } = useGame();

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- STRESS CALCS ---
  const maxStressTickets = 10;
  const stressPercentage = Math.min((pendingTicketCount / maxStressTickets) * 100, 100);
  
  const getStressColor = () => {
    if (pendingTicketCount >= 8) return 'bg-red-600';
    if (pendingTicketCount >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Respect Visual Effects Setting
  const isHighStress = pendingTicketCount >= 8 && userSettings.visualEffects;
  const showStressAnimations = userSettings.visualEffects;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'Lunch Service': return 'bg-blue-600';
      case 'Mid Service': return 'bg-yellow-600';
      case 'Dinner Rush': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getReputationColor = () => {
    if (reputation >= 70) return 'bg-green-500';
    if (reputation >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const handleDebugTicket = (e) => {
    e.stopPropagation();
    if (onDebugAddTicket) {
       const activeMenu = (selectedMenu && selectedMenu.length > 0)
        ? selectedMenu
        : [1, 2, 3, 4];
      
      const randomId = activeMenu[Math.floor(Math.random() * activeMenu.length)];
      const recipe = getRecipeById(randomId);
      
      if (recipe) {
        onDebugAddTicket({ ...recipe, uniqueId: Date.now() });
      }
    }
  };
  
  // Only show full HUD during Service
  if (shiftPhase !== 'Service') return null;

  return (
    <>
      <div className={`
        bg-gray-800 border-b-4 border-gray-900 p-4 shadow-xl z-40 relative transition-colors duration-1000
        ${isHighStress ? 'shadow-red-900/50' : ''}
      `}>
        <div className="max-w-7xl mx-auto relative">
          
          {/* Top Right Controls */}
          <div className="absolute -top-2 right-0 flex gap-2 z-50">
             <button 
              onClick={() => setIsLogOpen(!isLogOpen)}
              className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1 transition-colors
                ${isLogOpen ? 'bg-yellow-600 text-white border-yellow-500' : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'}
              `}
              title="Toggle Service Log"
            >
              <List className="h-3 w-3" /> LOG
            </button>

             <button 
              onClick={() => setIsSettingsOpen(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white text-[10px] px-2 py-1 rounded border border-gray-600 flex items-center gap-1 transition-colors"
              title="Settings"
            >
              <Settings className="h-3 w-3" />
            </button>

            {gameStatus === 'playing' && (
              <button 
                onClick={handleDebugTicket}
                className="bg-red-900/50 hover:bg-red-600 text-white text-[10px] px-2 py-1 rounded border border-red-800 flex items-center gap-1 transition-colors"
                title="Spawn Random Ticket"
              >
                <Bug className="h-3 w-3" /> DEBUG
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* STRESS LEVEL */}
            <div className={`
              bg-gray-900 rounded-lg p-3 border border-gray-700 relative overflow-hidden
              ${isHighStress ? 'animate-glow-red border-red-500' : ''}
            `}>
              <div className="flex items-center gap-2 mb-2">
                 <Flame className={`h-4 w-4 ${isHighStress ? 'text-red-500 animate-pulse' : 'text-orange-400'}`} />
                 <span className="text-xs text-gray-400 uppercase font-semibold">Stress</span>
              </div>
              <div className="text-sm font-bold text-white mb-1 flex justify-between">
                <span>{Math.round(stressPercentage)}%</span>
                <span className="text-[10px] text-gray-500">{pendingTicketCount} Queue</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full ${getStressColor()} transition-colors`}
                />
              </div>
            </div>

            {/* Reputation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsMenuModalOpen(true)}
              className={`
                bg-gray-900 rounded-lg p-3 border border-gray-700 cursor-pointer hover:border-yellow-500 transition-colors group
                ${showStressAnimations && isHighStress ? 'animate-stress-pulse' : ''}
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-400 group-hover:text-yellow-400" />
                <span className="text-xs text-gray-400 uppercase font-semibold group-hover:text-white">Reputation</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{reputation}</div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${reputation}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${getReputationColor()} transition-all`}
                />
              </div>
            </motion.div>

            {/* Money */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsStaffModalOpen(true)}
              className="bg-gray-900 rounded-lg p-3 border border-gray-700 cursor-pointer hover:border-green-500 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-400 group-hover:text-green-300" />
                <span className="text-xs text-gray-400 uppercase font-semibold group-hover:text-white">Funds</span>
              </div>
              <div className="text-2xl font-bold text-white">${money}</div>
            </motion.div>

            {/* Tickets */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`bg-gray-900 rounded-lg p-3 border border-gray-700 ${showStressAnimations && isHighStress ? 'border-red-500 animate-pulse' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className={`h-4 w-4 ${isHighStress ? 'text-red-500' : 'text-purple-400'}`} />
                <span className="text-xs text-gray-400 uppercase font-semibold">Served</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {ticketsServed} / {totalTickets}
              </div>
            </motion.div>

            {/* Service Time */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-gray-400 uppercase font-semibold">Time</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(serviceTime)}</div>
            </motion.div>

            {/* Current Phase */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 rounded-lg p-3 border border-gray-700 hidden lg:block"
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-gray-400 uppercase font-semibold">Phase</span>
              </div>
              <div className={`text-xs font-bold text-white px-2 py-1 rounded ${getPhaseColor()} text-center`}>
                {currentPhase}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Collapsible Service Log Panel */}
        <AnimatePresence>
          {isLogOpen && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute top-20 right-4 w-80 h-96 z-50"
            >
              <ServiceLogDisplay />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StaffManagementModal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} />
      <MenuLoadoutModal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default GameHUD;
