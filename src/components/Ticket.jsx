
import React from 'react';
import { motion } from 'framer-motion';

const Ticket = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-100 border-2 border-yellow-900 p-4 rounded shadow-lg font-mono text-sm w-full max-w-xs"
      style={{ fontFamily: 'Courier New, monospace' }}
    >
      <div className="border-b-2 border-dashed border-yellow-900 pb-2 mb-2">
        <div className="text-xs text-yellow-900 uppercase">*** ORDER TICKET ***</div>
      </div>
      
      <div className="space-y-2 text-yellow-950">
        <div>
          <div className="font-bold text-base uppercase">{recipe.name}</div>
        </div>
        
        <div className="border-t border-dashed border-yellow-800 pt-2">
          <div className="text-xs uppercase mb-1">Ingredients:</div>
          <div className="flex gap-2 text-lg">
            {recipe.ingredients.map((ingredient, idx) => (
              <span key={idx}>{ingredient}</span>
            ))}
          </div>
        </div>
        
        <div className="border-t border-dashed border-yellow-800 pt-2">
          <div className="text-xs uppercase mb-1">Plating:</div>
          <div className="text-xs">{recipe.platingDescription}</div>
        </div>
      </div>
      
      <div className="border-t-2 border-dashed border-yellow-900 mt-2 pt-2">
        <div className="text-xs text-center text-yellow-900">EXEC CHEF APPROVAL REQUIRED</div>
      </div>
    </motion.div>
  );
};

export default Ticket;
