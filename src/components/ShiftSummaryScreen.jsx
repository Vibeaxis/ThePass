
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Button } from './ui/button';
import { ArrowRight, Trophy, TrendingUp, DollarSign, ChefHat } from 'lucide-react';
import { GRADE_THRESHOLDS } from '@/data/serviceLogGradeSystem';

const ShiftSummaryScreen = () => {
  const { 
    serviceLog, 
    currentServiceStats, 
    careerStats, 
    advanceShift 
  } = useGame();

  // Determine shift performance mood
  const isGoodShift = ['S', 'A'].includes(currentServiceStats.averageGrade);
  const bgColor = isGoodShift 
    ? 'bg-gradient-to-br from-green-900 via-slate-900 to-black' 
    : 'bg-gradient-to-br from-red-900 via-slate-900 to-black';

  // Find best/worst dish
  const bestDish = [...serviceLog].sort((a, b) => b.profitLoss - a.profitLoss)[0];
  const worstDish = [...serviceLog].sort((a, b) => a.profitLoss - b.profitLoss)[0];

  // Get a few notes
  const notableNotes = serviceLog
    .filter(e => e.note.length > 5)
    .slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 font-mono ${bgColor}`}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-700 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
           
           <motion.div variants={itemVariants}>
             <h2 className="text-slate-400 text-sm uppercase tracking-[0.5em] mb-2">Service Report</h2>
             <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">
               DAY {careerStats.totalShiftsCompleted} COMPLETE
             </h1>
             <div className="inline-flex items-center gap-3 bg-slate-800 px-6 py-2 rounded-full border border-slate-600">
               <span className="text-slate-400 uppercase text-xs">Final Grade</span>
               <span className={`text-2xl font-bold ${isGoodShift ? 'text-green-400' : 'text-red-400'}`}>
                 {currentServiceStats.averageGrade}
               </span>
             </div>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
           {/* Left Col: Stats */}
           <div className="p-8 border-r border-slate-700 space-y-8">
              <motion.div variants={itemVariants} className="space-y-4">
                 <h3 className="text-slate-500 uppercase text-xs font-bold flex items-center gap-2">
                   <TrendingUp size={14} /> Service Metrics
                 </h3>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded border border-slate-700">
                       <div className="text-slate-500 text-[10px] uppercase">Dishes Served</div>
                       <div className="text-2xl font-bold text-white">{currentServiceStats.dishesServed}</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded border border-slate-700">
                       <div className="text-slate-500 text-[10px] uppercase">Total Profit</div>
                       <div className={`text-2xl font-bold ${currentServiceStats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                         ${currentServiceStats.totalProfit}
                       </div>
                    </div>
                 </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                 <h3 className="text-slate-500 uppercase text-xs font-bold mb-3 flex items-center gap-2">
                   <Trophy size={14} /> Grade Breakdown
                 </h3>
                 <div className="space-y-2">
                    {Object.entries(currentServiceStats.gradeBreakdown).map(([grade, count]) => (
                      <div key={grade} className="flex items-center gap-2 text-sm">
                         <div className={`w-8 h-8 flex items-center justify-center rounded font-bold bg-slate-800 border border-slate-700
                           ${grade === 'S' ? 'text-yellow-400' : grade === 'F' ? 'text-red-500' : 'text-slate-200'}
                         `}>
                           {grade}
                         </div>
                         <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-slate-600" 
                              style={{ width: `${(count / currentServiceStats.dishesServed) * 100}%` }} 
                            />
                         </div>
                         <div className="text-slate-400 w-8 text-right">{count}</div>
                      </div>
                    ))}
                 </div>
              </motion.div>
           </div>

           {/* Middle Col: Highlights */}
           <div className="p-8 border-r border-slate-700 space-y-8">
              <motion.div variants={itemVariants}>
                 <h3 className="text-slate-500 uppercase text-xs font-bold mb-4 flex items-center gap-2">
                   <ChefHat size={14} /> Kitchen Highlights
                 </h3>
                 
                 {bestDish && (
                   <div className="mb-4 bg-green-900/10 border border-green-900/30 p-4 rounded">
                      <div className="text-[10px] text-green-500 uppercase mb-1">Top Earner</div>
                      <div className="font-bold text-green-100">{bestDish.dishName}</div>
                      <div className="text-sm text-green-400">+${bestDish.profitLoss} ({bestDish.grade})</div>
                   </div>
                 )}
                 
                 {worstDish && worstDish.profitLoss < 0 && (
                   <div className="bg-red-900/10 border border-red-900/30 p-4 rounded">
                      <div className="text-[10px] text-red-500 uppercase mb-1">Kitchen Nightmare</div>
                      <div className="font-bold text-red-100">{worstDish.dishName}</div>
                      <div className="text-sm text-red-400">-${Math.abs(worstDish.profitLoss)} ({worstDish.grade})</div>
                   </div>
                 )}

                 {!bestDish && <div className="text-slate-600 italic">No dishes served.</div>}
              </motion.div>
           </div>

           {/* Right Col: Notes & Career */}
           <div className="p-8 flex flex-col justify-between">
              <motion.div variants={itemVariants}>
                 <h3 className="text-slate-500 uppercase text-xs font-bold mb-4">Chef's Notes</h3>
                 <div className="space-y-3">
                   {notableNotes.length > 0 ? notableNotes.map((entry, i) => (
                     <div key={i} className="text-sm text-slate-300 italic border-l-2 border-slate-700 pl-3">
                       "{entry.note}"
                     </div>
                   )) : (
                     <div className="text-slate-600 italic">Silence from the pass...</div>
                   )}
                 </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-slate-700">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Career Earnings</div>
                      <div className="text-xl font-bold text-white">${careerStats.careerMoney}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] text-slate-500 uppercase">Reputation</div>
                       <div className="text-xl font-bold text-white">{careerStats.careerReputation}</div>
                    </div>
                 </div>

                 <Button 
                   onClick={advanceShift}
                   className="w-full h-14 bg-yellow-600 hover:bg-yellow-700 text-black font-bold text-lg tracking-widest"
                 >
                   NEXT SHIFT <ArrowRight className="ml-2" />
                 </Button>
              </motion.div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShiftSummaryScreen;
