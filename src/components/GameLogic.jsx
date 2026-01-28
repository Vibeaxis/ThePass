
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { evaluateDish } from '@/utils/dishGenerator';
import { useToast } from '@/components/ui/use-toast';

const GameLogic = ({ currentRecipe, currentDish, onComplete }) => {
  const {
    adjustReputation,
    adjustMoney,
    incrementTicketsServed,
    unlockRecipe
  } = useGame();
  const { toast } = useToast();

  const handleService = () => {
    const evaluation = evaluateDish(currentDish, currentRecipe);

    if (evaluation.isPerfect) {
      // Perfect dish approved
      const repGain = currentRecipe.baseRepValue;
      adjustReputation(repGain);
      
      toast({
        title: '✨ PERFECT DISH!',
        description: `Gained +${repGain} reputation. Customers are delighted!`,
        className: 'bg-green-600 text-white border-green-700'
      });

      // Unlock recipe for next day
      unlockRecipe(currentRecipe.id);
    } else if (evaluation.isAcceptable) {
      // Acceptable dish approved - minor penalty
      adjustReputation(-3);
      
      toast({
        title: '⚠️ Acceptable',
        description: 'Not perfect, but passable. -3 reputation.',
        className: 'bg-yellow-600 text-white border-yellow-700'
      });
    } else {
      // Flawed dish approved - major penalty
      const repLoss = Math.abs(Math.floor(evaluation.score / 2));
      adjustReputation(-repLoss);
      
      toast({
        title: '❌ CUSTOMER COMPLAINT!',
        description: `Issues: ${evaluation.issues.join(', ')}. Lost -${repLoss} reputation!`,
        className: 'bg-red-600 text-white border-red-700'
      });
    }

    incrementTicketsServed();
    onComplete();
  };

  const handleReject = () => {
    const evaluation = evaluateDish(currentDish, currentRecipe);

    if (evaluation.isPerfect || evaluation.isAcceptable) {
      // Rejected a good dish - waste money
      const moneyLoss = currentRecipe.baseCost;
      adjustMoney(-moneyLoss);
      
      toast({
        title: '💸 FOOD WASTE!',
        description: `Rejected a good dish. Lost $${moneyLoss} in wasted ingredients.`,
        className: 'bg-orange-600 text-white border-orange-700'
      });
    } else {
      // Correctly rejected a flawed dish
      toast({
        title: '✅ Good Call!',
        description: 'Flawed dish rejected. Kitchen will fix it.',
        className: 'bg-blue-600 text-white border-blue-700'
      });
    }

    incrementTicketsServed();
    onComplete();
  };

  return {
    handleService,
    handleReject
  };
};

export default GameLogic;
