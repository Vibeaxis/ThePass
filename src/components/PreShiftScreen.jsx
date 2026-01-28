
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Play, ChefHat, Users, AlertCircle, Award } from 'lucide-react';
import { getRecipeById } from '@/data/recipes'; 
import MenuLoadoutModal from './MenuLoadoutModal';
import { motion } from 'framer-motion';

const PreShiftScreen = () => {
  const {
    currentBookingDifficulty = 'Normal', 
    selectedMenu = [],
    startShift,
    careerStats
  } = useGame();

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const getDifficultyColor = () => {
    switch (currentBookingDifficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-500';
      default: return 'text-white';
    }
  };

  const getDifficultyDescription = () => {
    switch (currentBookingDifficulty) {
      case 'Easy': return "Slow night expected. Good for training staff.";
      case 'Medium': return "Standard service flow. Keep the pace steady.";
      case 'Hard': return "Full house booked! Expect heavy rushes.";
      default: return "Service is ready.";
    }
  };

  const getCustomerCount = () => {
    switch (currentBookingDifficulty) {
      case 'Easy': return "20-30 Covers";
      case 'Medium': return "30-40 Covers";
      case 'Hard': return "45-50 Covers";
      default: return "Unknown Covers";
    }
  };

  // Safe check for length
  const canStart = selectedMenu?.length > 0;
  const currentMilestone = careerStats?.currentMilestone || "Sous Chef";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200 font-mono relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

      <div className="max-w-4xl w-full z-10">
        <div className="text-center mb-8">
          <h3 className="text-slate-500 uppercase tracking-[0.3em] text-sm mb-2">Pre-Shift Briefing</h3>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            DAY {careerStats?.totalShiftsCompleted + 1 || 1}
          </h1>

          <div className="flex items-center justify-center gap-4">
             <div className={`text-xl font-bold uppercase ${getDifficultyColor()} border inline-block px-4 py-1 rounded border-current`}>
               {currentBookingDifficulty} Booking
             </div>
             <div className="text-xl font-bold uppercase text-yellow-500 border border-yellow-500 px-4 py-1 rounded flex items-center gap-2">
               <Award size={16} /> {currentMilestone}
             </div>
          </div>
          <p className="mt-4 text-slate-400 italic">"{getDifficultyDescription()}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Menu Preview */}
          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ChefHat className="text-yellow-500" /> TODAYS MENU
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMenuModalOpen(true)}
                className="text-xs border-slate-600 hover:bg-slate-800"
              >
                CHANGE MENU
              </Button>
            </div>

            {/* Safe Length Check */}
            {!selectedMenu || selectedMenu.length === 0 ? (
              <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded">
                <AlertCircle className="mx-auto mb-2 opacity-50" />
                No dishes selected.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedMenu.map(id => {
                  const r = getRecipeById(id);
                  if (!r) return null;
                  return (
                    <div key={id} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 last:border-0">
                      <span>{r.name}</span>
                      <span className="text-slate-500">${r.baseCost * 2}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Forecast */}
          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-lg backdrop-blur-sm flex flex-col justify-center">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Users className="text-blue-500" /> FORECAST
            </h2>
            <div className="space-y-6">
              <div>
                <div className="text-xs text-slate-500 uppercase mb-1">Expected Covers</div>
                <div className="text-3xl font-bold text-white">{getCustomerCount()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase mb-1">Est. Revenue</div>
                <div className="text-3xl font-bold text-green-400">$1,200 - $2,500</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={startShift}
            disabled={!canStart}
            className="h-16 px-12 text-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {canStart ? (
              <><Play className="mr-3 fill-current" /> OPEN RESTAURANT</>
            ) : (
              "SELECT 5 DISHES TO START"
            )}
          </Button>
        </div>
      </div>

      <MenuLoadoutModal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} />
    </div>
  );
};

export default PreShiftScreen;
