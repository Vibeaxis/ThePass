
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { RECIPES, getRecipeById } from '@/data/recipes';
import { Check, Lock, X } from 'lucide-react';
import ModalOverlay from './ui/ModalOverlay';

const MenuLoadoutModal = ({ isOpen, onClose }) => {
  const { unlockedRecipes, selectedMenu, setSelectedMenu, careerStats } = useGame();
  
  const currentMilestone = careerStats?.currentMilestone || "Sous Chef";

  // Combine all recipes
  const allRecipes = [
    ...RECIPES.simple,
    ...RECIPES.medium,
    ...RECIPES.complex,
    ...RECIPES.french
  ];

  // Helper to determine if a category is unlocked based on milestone
  const isRecipeTypeUnlocked = (recipe) => {
    // Simple are always unlocked
    if (RECIPES.simple.find(r => r.id === recipe.id)) return true;
    
    // Medium requires Head Chef (5 shifts)
    if (RECIPES.medium.find(r => r.id === recipe.id)) {
      return currentMilestone !== "Sous Chef";
    }

    // Complex/French requires Executive Chef (10 shifts)
    if (RECIPES.complex.find(r => r.id === recipe.id) || RECIPES.french.find(r => r.id === recipe.id)) {
      return currentMilestone === "Executive Chef" || currentMilestone === "Michelin Star";
    }

    return false;
  };

  const handleToggleRecipe = (recipe) => {
    if (!isRecipeTypeUnlocked(recipe)) return; // Locked

    if (selectedMenu.includes(recipe.id)) {
      setSelectedMenu(prev => prev.filter(id => id !== recipe.id));
    } else {
      if (selectedMenu.length < 5) {
        setSelectedMenu(prev => [...prev, recipe.id]);
      }
    }
  };

  const getDifficultyColor = (cost) => {
    if (cost < 20) return 'text-green-400';
    if (cost < 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getDifficultyLabel = (cost) => {
    if (cost < 20) return 'EASY';
    if (cost < 40) return 'MED';
    return 'HARD';
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-900 border-2 border-slate-600 rounded-lg p-6 shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4 flex-shrink-0">
          <div>
            <h2 className="text-3xl font-mono font-bold text-white tracking-tight">MENU LOADOUT</h2>
            <p className="text-slate-400 font-mono text-sm">Select exactly 5 dishes for service</p>
          </div>
          <div className="text-right">
             <div className="text-slate-400 text-xs uppercase">Current Loadout</div>
             <div className={`text-2xl font-mono font-bold ${selectedMenu.length === 5 ? 'text-green-400' : 'text-yellow-500'}`}>
               {selectedMenu.length} / 5
             </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
           {allRecipes.map((recipe) => {
             const unlocked = isRecipeTypeUnlocked(recipe);
             const isSelected = selectedMenu.includes(recipe.id);
             
             return (
               <div 
                 key={recipe.id}
                 onClick={() => handleToggleRecipe(recipe)}
                 className={`
                   relative p-3 rounded-md border-2 transition-all cursor-pointer
                   ${!unlocked ? 'bg-slate-950 border-slate-800 opacity-60 grayscale cursor-not-allowed' : 
                     isSelected ? 'bg-yellow-900/20 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 
                     'bg-slate-800 border-slate-700 hover:border-slate-500'}
                 `}
               >
                 {isSelected && (
                   <div className="absolute top-2 right-2 bg-yellow-500 text-black rounded-full p-0.5">
                     <Check size={12} strokeWidth={4} />
                   </div>
                 )}
                 {!unlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 backdrop-blur-[1px]">
                      <Lock className="text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-300 bg-black/80 px-2 py-0.5 rounded border border-slate-700">
                        Rank Locked
                      </span>
                    </div>
                 )}

                 <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{recipe.ingredients[0]}</span>
                    <span className={`text-[10px] font-bold font-mono border px-1 rounded ${getDifficultyColor(recipe.baseCost)} border-current opacity-80`}>
                      {getDifficultyLabel(recipe.baseCost)}
                    </span>
                 </div>
                 
                 <h3 className={`font-bold font-mono text-sm mb-1 ${isSelected ? 'text-yellow-100' : 'text-slate-200'}`}>
                   {recipe.name}
                 </h3>
                 
                 <div className="text-[10px] text-slate-400 mb-2 truncate">
                   {recipe.platingDescription}
                 </div>
                 
                 <div className="flex justify-between items-end mt-auto text-xs font-mono">
                   <span className="text-green-500">Earn: ${recipe.baseCost * 2}</span>
                   <span className="text-slate-500">Rep: {recipe.baseRepValue}</span>
                 </div>
               </div>
             );
           })}
        </div>
        
        {/* Footer info */}
        <div className="bg-slate-950 p-3 rounded border border-slate-800 mb-4 flex-shrink-0">
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span className="text-yellow-500 font-bold">⚠️ UNLOCKS:</span> 
            Rank up to 'Head Chef' to unlock Medium tier. 'Executive Chef' unlocks Complex tier.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-shrink-0 pt-2 border-t border-slate-700">
           <Button 
             onClick={onClose} 
             variant="ghost" 
             className="flex-1 text-slate-400 hover:text-white"
           >
             CANCEL
           </Button>
           <Button 
             onClick={onClose} 
             disabled={selectedMenu.length !== 5}
             className="flex-[2] bg-yellow-600 hover:bg-yellow-700 text-black font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
           >
             CONFIRM MENU
           </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default MenuLoadoutModal;
