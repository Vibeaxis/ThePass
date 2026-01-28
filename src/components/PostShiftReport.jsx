
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, DollarSign, TrendingUp, Award, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const PostShiftReport = () => {
  const { shiftSummary, advanceShift, careerStats } = useGame();
  
  // Basic wage calculation (e.g. $50 flat + $10 per served dish as labor cost estimation)
  const wages = 150; 
  const totalExpenses = Math.abs(shiftSummary.wastedFoodCost) + wages;
  const netProfit = shiftSummary.totalSales - totalExpenses;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200 font-mono overflow-y-auto">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full bg-slate-900 border-t-4 border-slate-600 shadow-2xl p-8 rounded-b-lg"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
           <h1 className="text-4xl font-bold text-white mb-2">SHIFT REPORT</h1>
           <p className="text-slate-500">Day {careerStats.currentShiftNumber} Complete</p>
        </motion.div>

        {/* Financials */}
        <div className="space-y-4 mb-10">
           <motion.div variants={itemVariants} className="flex justify-between items-center text-lg">
             <span className="text-slate-400">Total Sales</span>
             <span className="text-white font-bold">${shiftSummary.totalSales.toFixed(2)}</span>
           </motion.div>
           
           <motion.div variants={itemVariants} className="flex justify-between items-center text-red-400">
             <span>Food Waste</span>
             <span>-${Math.abs(shiftSummary.wastedFoodCost).toFixed(2)}</span>
           </motion.div>
           
           <motion.div variants={itemVariants} className="flex justify-between items-center text-red-400 border-b border-slate-700 pb-4">
             <span>Staff Wages</span>
             <span>-${wages.toFixed(2)}</span>
           </motion.div>
           
           <motion.div variants={itemVariants} className="flex justify-between items-center text-2xl font-bold pt-2">
             <span>NET PROFIT</span>
             <span className={netProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
               {netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)}
             </span>
           </motion.div>
        </div>

        {/* Progression Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
           <motion.div variants={itemVariants} className="bg-slate-800 p-4 rounded text-center">
              <TrendingUp className="mx-auto mb-2 text-blue-400" />
              <div className="text-xs text-slate-500 uppercase">Reputation Gained</div>
              <div className="text-xl font-bold text-white">+{shiftSummary.reputationGain}</div>
           </motion.div>
           
           <motion.div variants={itemVariants} className="bg-slate-800 p-4 rounded text-center">
              <Award className="mx-auto mb-2 text-yellow-400" />
              <div className="text-xs text-slate-500 uppercase">Recipes Unlocked</div>
              <div className="text-xl font-bold text-white">{shiftSummary.recipesUnlockedThisShift.length}</div>
           </motion.div>
        </div>

        {/* Next Step */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <Button 
            onClick={advanceShift}
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 font-bold tracking-widest"
          >
            ADVANCE TO DAY {careerStats.currentShiftNumber + 1} <ArrowRight className="ml-2" />
          </Button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default PostShiftReport;
