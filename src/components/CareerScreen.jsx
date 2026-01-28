
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Trophy, ChefHat, TrendingUp, DollarSign, Award, ArrowLeft, Star, Utensils, CheckCircle } from 'lucide-react';

const CareerScreen = ({ onBack }) => {
  const { careerStats } = useGame();

  const {
    totalShiftsCompleted = 0,
    totalDishesCooked = 0,
    totalPerfectDishes = 0,
    careerReputation = 0,
    careerMoney = 0,
    currentMilestone = "Sous Chef"
  } = careerStats;

  // Milestone Progression Logic
  const getNextMilestone = () => {
    if (totalShiftsCompleted < 5) return { name: "Head Chef", target: 5 };
    if (totalShiftsCompleted < 10) return { name: "Executive Chef", target: 10 };
    if (totalShiftsCompleted < 15) return { name: "Michelin Star", target: 15 };
    return { name: "Legend", target: 100 };
  };

  const nextMilestone = getNextMilestone();
  const progressPercent = Math.min(100, Math.max(0, (totalShiftsCompleted / nextMilestone.target) * 100));

  const challenges = [
    {
      id: 1,
      name: "Speed Demon",
      desc: "Cook 10 dishes in 5 min",
      reward: "+$500",
      completed: careerStats.bestStats?.mostDishesServed >= 10
    },
    {
      id: 2,
      name: "Perfect Service",
      desc: "100% accuracy on 20 dishes",
      reward: "+$300",
      completed: totalPerfectDishes >= 20
    },
    {
      id: 3,
      name: "Consistency",
      desc: "Complete 5 shifts",
      reward: "+$400",
      completed: totalShiftsCompleted >= 5
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-6 flex flex-col items-center overflow-y-auto">
      <div className="max-w-5xl w-full">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={onBack} variant="ghost" className="text-slate-400 hover:text-white">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Title
          </Button>
          <h1 className="text-3xl font-bold tracking-wider text-yellow-500 uppercase">Career Profile</h1>
        </div>

        {/* Milestone Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-yellow-500/30 rounded-lg p-8 mb-8 relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <ChefHat size={120} />
           </div>
           
           <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full w-24 h-24 flex items-center justify-center shadow-lg border-4 border-slate-800">
                <Trophy size={40} className="text-white" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                 <div className="text-sm text-yellow-500 font-bold uppercase tracking-widest mb-1">Current Rank</div>
                 <h2 className="text-4xl font-bold text-white mb-2">{currentMilestone}</h2>
                 <p className="text-slate-400 text-sm max-w-lg mb-4">
                   {currentMilestone === 'Sous Chef' && "You run the line, but you don't own it yet. Prove your worth."}
                   {currentMilestone === 'Head Chef' && "The kitchen is yours. Menus are unlocked. Don't mess it up."}
                   {currentMilestone === 'Executive Chef' && "You are a master of the craft. Your name brings in the crowds."}
                   {currentMilestone === 'Michelin Star' && "Perfection is the only standard. You are a legend."}
                 </p>
                 
                 <div className="w-full bg-slate-800 rounded-full h-4 relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1 }}
                      className="absolute top-0 left-0 h-full bg-yellow-500"
                    />
                 </div>
                 <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>{totalShiftsCompleted} Shifts</span>
                    <span>Next Rank: {nextMilestone.name} ({nextMilestone.target} Shifts)</span>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
              <div className="text-slate-500 text-xs uppercase mb-1 flex items-center gap-2"><TrendingUp size={14}/> Career Shifts</div>
              <div className="text-3xl font-bold">{totalShiftsCompleted}</div>
           </div>
           <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
              <div className="text-slate-500 text-xs uppercase mb-1 flex items-center gap-2"><Utensils size={14}/> Dishes Cooked</div>
              <div className="text-3xl font-bold text-blue-400">{totalDishesCooked}</div>
           </div>
           <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
              <div className="text-slate-500 text-xs uppercase mb-1 flex items-center gap-2"><Star size={14}/> Perfect Dishes</div>
              <div className="text-3xl font-bold text-yellow-400">{totalPerfectDishes}</div>
           </div>
           <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
              <div className="text-slate-500 text-xs uppercase mb-1 flex items-center gap-2"><DollarSign size={14}/> Total Earnings</div>
              <div className="text-3xl font-bold text-green-400">${careerMoney.toLocaleString()}</div>
           </div>
        </div>

        {/* Challenges */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
           <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
             <Award className="text-purple-400" /> Prestige Challenges
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {challenges.map(challenge => (
                <div 
                  key={challenge.id} 
                  className={`p-4 rounded border ${challenge.completed ? 'bg-purple-900/20 border-purple-500/50' : 'bg-slate-950 border-slate-800'} relative`}
                >
                  {challenge.completed && (
                    <div className="absolute top-2 right-2 text-green-400">
                      <CheckCircle size={16} />
                    </div>
                  )}
                  <div className="text-sm font-bold text-slate-200 mb-1">{challenge.name}</div>
                  <div className="text-xs text-slate-500 mb-3">{challenge.desc}</div>
                  <div className="text-xs font-mono text-yellow-500 bg-yellow-900/20 inline-block px-2 py-1 rounded">
                    Reward: {challenge.reward}
                  </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default CareerScreen;
