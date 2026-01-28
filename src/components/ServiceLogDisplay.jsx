
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Clock, Hash, Activity } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

const ServiceLogDisplay = () => {
  const { serviceLog, currentServiceStats, serviceTime } = useGame();
  const scrollRef = useRef(null);

  // Helper to format time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'S': return 'text-yellow-400 font-bold';
      case 'A': return 'text-green-400 font-bold';
      case 'B': return 'text-yellow-600 font-bold';
      case 'F': return 'text-red-500 font-bold';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
      {/* Header Stats */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <Hash size={10} /> Served
          </div>
          <div className="text-xl font-mono text-white font-bold">{currentServiceStats.dishesServed}</div>
        </div>
        <div>
           <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <DollarSign size={10} /> Profit
          </div>
          <div className={`text-xl font-mono font-bold ${currentServiceStats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${currentServiceStats.totalProfit}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <Activity size={10} /> Avg Grd
          </div>
          <div className={`text-xl font-mono font-bold ${getGradeColor(currentServiceStats.averageGrade)}`}>
            {currentServiceStats.averageGrade}
          </div>
        </div>
      </div>

      {/* Scrollable Log */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-900/50" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {serviceLog.length === 0 && (
             <div className="text-center text-slate-600 text-xs py-10 italic">
               No dishes served yet...
             </div>
          )}
          {serviceLog.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800 border-l-4 rounded p-2 text-sm relative group"
              style={{ 
                borderLeftColor: entry.grade === 'S' ? '#facc15' : 
                               entry.grade === 'A' ? '#4ade80' : 
                               entry.grade === 'F' ? '#ef4444' : '#ca8a04' 
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-200 truncate pr-2">{entry.dishName}</span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock size={10} /> {formatTime(entry.timestamp)}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 ${getGradeColor(entry.grade)}`}>
                    {entry.grade}
                  </span>
                  <span className={entry.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {entry.profitLoss >= 0 ? '+' : ''}${entry.profitLoss}
                  </span>
                </div>
              </div>
              
              <div className="mt-1 text-[10px] italic text-slate-400 border-t border-slate-700 pt-1">
                "{entry.note}"
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServiceLogDisplay;
