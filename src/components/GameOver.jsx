
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { TrendingUp, DollarSign, ClipboardList, Award, RefreshCw, LogOut } from 'lucide-react';

const GameOver = ({ onRestart, onReturnToTitle }) => {
  const {
    gameStatus,
    reputation,
    money,
    ticketsServed,
    totalTickets,
    unlockedRecipes,
    careerStats
  } = useGame();

  const isFired = gameStatus === 'fired';
  const survived = gameStatus === 'survived';

  const getCareerMessage = (shiftNum) => {
    if (shiftNum < 3) return "Just getting started. Keep your head down.";
    if (shiftNum < 5) return "You're finding your rhythm.";
    if (shiftNum < 10) return "The kitchen respects you now.";
    return "You're a legend in this city.";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-black font-mono"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="bg-slate-900 rounded-none p-0 max-w-3xl w-full border-2 border-slate-600 shadow-2xl overflow-hidden"
      >
        {/* Status Header */}
        <div className={`p-8 text-center ${isFired ? 'bg-red-900/20 border-b border-red-900' : 'bg-green-900/20 border-b border-green-900'}`}>
          {isFired ? (
            <>
              <h1 className="text-5xl font-bold text-red-500 mb-2 tracking-tighter">TERMINATED</h1>
              <p className="text-xl text-red-300/60 font-mono">PACK YOUR KNIVES AND GO.</p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-green-500 mb-2 tracking-tighter">SHIFT COMPLETE</h1>
              <p className="text-xl text-green-300/60 font-mono">EXCELLENT SERVICE, CHEF.</p>
            </>
          )}
        </div>

        <div className="p-8">
          {/* Shift Stats */}
          <div className="mb-8">
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Shift Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-3 border border-slate-700">
                <div className="text-slate-500 text-[10px] uppercase mb-1">Reputation</div>
                <div className="text-2xl text-white font-bold">{reputation}</div>
              </div>
              <div className="bg-slate-800/50 p-3 border border-slate-700">
                <div className="text-slate-500 text-[10px] uppercase mb-1">Money</div>
                <div className="text-2xl text-green-400 font-bold">${money}</div>
              </div>
              <div className="bg-slate-800/50 p-3 border border-slate-700">
                <div className="text-slate-500 text-[10px] uppercase mb-1">Tickets</div>
                <div className="text-2xl text-white font-bold">{ticketsServed} / {totalTickets}</div>
              </div>
              <div className="bg-slate-800/50 p-3 border border-slate-700">
                <div className="text-slate-500 text-[10px] uppercase mb-1">Unlocked</div>
                <div className="text-2xl text-yellow-400 font-bold">{unlockedRecipes.length}</div>
              </div>
            </div>
          </div>

          {/* Career Stats */}
          <div className="mb-8">
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Career Overview</h3>
            <div className="bg-slate-950 p-4 border border-slate-800 grid grid-cols-2 gap-4">
               <div>
                  <div className="text-slate-500 text-[10px] uppercase">Current Day</div>
                  <div className="text-xl text-white font-mono">Day {careerStats.currentShiftNumber}</div>
               </div>
               <div>
                  <div className="text-slate-500 text-[10px] uppercase">Lifetime Money</div>
                  <div className="text-xl text-green-400 font-mono">${careerStats.careerMoney}</div>
               </div>
               <div className="col-span-2 mt-2 pt-2 border-t border-slate-800">
                  <p className="text-slate-400 text-sm italic">"{getCareerMessage(careerStats.currentShiftNumber)}"</p>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={onRestart}
              className="flex-1 bg-slate-100 hover:bg-white text-slate-900 font-bold py-6 text-lg transition-all"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              {isFired ? 'RETRY SHIFT' : 'NEXT SHIFT'}
            </Button>
            <Button
              onClick={onReturnToTitle}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-white py-6 text-lg"
            >
              <LogOut className="mr-2 h-5 w-5" />
              TITLE SCREEN
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameOver;
