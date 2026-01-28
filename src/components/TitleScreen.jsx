
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Play, Trash2, Trophy, Settings } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { useToast } from './ui/use-toast';
import SettingsPanel from './SettingsPanel';

const TitleScreen = ({ onStartNewGame, onContinueGame, onViewCareer, hasSave }) => {
  const { resetCareerData, careerStats } = useGame();
  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleResetSave = () => {
    if (window.confirm("WARNING: This will permanently delete your career progress and kitchen upgrades. Are you sure?")) {
      resetCareerData();
      toast({
        title: "Save Data Cleared",
        description: "Starting fresh!",
        duration: 3000,
      });
    }
  };

  const handleHardReset = () => {
    if(window.confirm("EMERGENCY RESET: Clear all data and reload?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Safe access to career stats
  const currentDay = careerStats?.currentShiftNumber || 1;
  const currentMilestone = careerStats?.currentMilestone || "Sous Chef";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-10" />

      {/* Settings Button */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-40"
      >
        <Settings className="w-8 h-8" />
      </button>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl w-full"
      >
        {/* Title */}
        <h1 className="text-5xl md:text-8xl font-mono tracking-widest text-slate-100 font-bold mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          THE PASS
        </h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-yellow-500 font-mono tracking-wider text-sm md:text-lg mb-8 uppercase"
        >
          The only service sim that matters
        </motion.p>

        {/* Milestone Badge */}
        {hasSave && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-yellow-900/30 text-yellow-500 border border-yellow-700/50 px-4 py-1 rounded-full text-xs font-bold uppercase mb-8"
          >
             <Trophy size={14} /> {currentMilestone}
          </motion.div>
        )}

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-slate-400 mb-12 italic text-sm md:text-base border-l-2 border-red-600 pl-4 mx-auto max-w-lg text-left"
        >
          "You are the Head Chef at the pass. Every dish that leaves this kitchen reflects your standards. Judge wisely."
        </motion.p>

        {/* Actions */}
        <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
          {hasSave ? (
            <>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Button 
                  onClick={onContinueGame}
                  className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-mono text-lg tracking-widest border border-red-800 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all transform hover:scale-105"
                >
                  <Play className="mr-2 h-5 w-5" /> CONTINUE SHIFT {currentDay}
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <Button 
                  onClick={onViewCareer}
                  className="w-full h-14 bg-slate-800 hover:bg-slate-700 text-white font-mono text-lg tracking-widest border border-slate-600 transition-all transform hover:scale-105"
                >
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> CAREER
                </Button>
              </motion.div>
            </>
          ) : (
             <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Button 
                onClick={onStartNewGame}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-mono text-lg tracking-widest border border-red-800 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all transform hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" /> START CAREER
              </Button>
            </motion.div>
          )}
        </div>
        
        {/* Standard Reset Save Button (Context Based) */}
        {hasSave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-8"
          >
            <button
              onClick={handleResetSave}
              className="text-xs text-red-900/50 hover:text-red-500 flex items-center gap-1 transition-colors uppercase tracking-wider font-bold"
            >
              <Trash2 className="h-3 w-3" /> Reset Save Data
            </button>
          </motion.div>
        )}

        <div className="mt-8 text-[10px] text-slate-600 font-mono">
          v0.2.1 • BUILT WITH REACT & VITE • SHADCN/UI
        </div>

        {/* Emergency Fixed Reset Button */}
        <button
          onClick={handleHardReset}
          className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-xs font-bold rounded z-50 shadow-lg border border-red-800 opacity-80 hover:opacity-100 transition-all"
          aria-label="Clear all save data and reset the game"
          title="Clear all save data and reset the game"
        >
          RESET DATA
        </button>

      </motion.div>
    </div>
  );
};

export default TitleScreen;
