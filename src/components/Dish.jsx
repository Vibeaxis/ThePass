
import React from 'react';
import { motion } from 'framer-motion';

const Dish = ({ dish, recipe }) => {
  if (!dish || !recipe) return null;

  const getTemperatureColor = () => {
    switch (dish.temperature) {
      case 'Blue/Raw': return 'text-blue-400';
      case 'Rare': return 'text-red-400';
      case 'Medium Rare': return 'text-pink-400';
      case 'Medium': return 'text-orange-400';
      case 'Well Done': return 'text-amber-700';
      default: return 'text-gray-700';
    }
  };

  const getCookLevelColor = () => {
    switch (dish.cookLevel) {
      case 'Burnt': return 'text-red-600';
      case 'Overcooked': return 'text-orange-500';
      case 'Perfect': return 'text-green-500';
      case 'Undercooked': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getPlatingColor = () => {
    switch (dish.platingQuality) {
      case 'Sloppy': return 'text-red-500';
      case 'Acceptable': return 'text-yellow-500';
      case 'Perfect': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getIngredientStyle = (ingredient, index) => {
    let style = {
      fontSize: '2.5rem',
      transition: 'all 0.3s ease'
    };

    // Check if ingredient is missing
    if (dish.missingIngredients.includes(index)) {
      return { ...style, opacity: 0, pointerEvents: 'none' };
    }

    // Apply cook level effects
    if (dish.cookLevel === 'Burnt') {
      style.filter = 'grayscale(100%) brightness(30%)';
    }

    // Apply plating quality effects
    if (dish.platingQuality === 'Sloppy') {
      const randomX = (Math.random() - 0.5) * 40;
      const randomY = (Math.random() - 0.5) * 40;
      const randomRotate = (Math.random() - 0.5) * 60;
      style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
    }

    return style;
  };

  const plateAnimation = dish.cookLevel === 'Blue/Raw' ? {
    boxShadow: [
      '0 0 0 0 rgba(239, 68, 68, 0)',
      '0 0 0 20px rgba(239, 68, 68, 0.4)',
      '0 0 0 0 rgba(239, 68, 68, 0)'
    ]
  } : {};

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Plate */}
      <motion.div
        animate={plateAnimation}
        transition={{
          duration: 1.5,
          repeat: dish.cookLevel === 'Blue/Raw' ? Infinity : 0,
          ease: 'easeInOut'
        }}
        className="relative bg-white rounded-full shadow-2xl flex items-center justify-center"
        style={{
          width: '280px',
          height: '280px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <div className="relative flex flex-wrap items-center justify-center gap-2 p-8">
          {recipe.ingredients.map((ingredient, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              style={getIngredientStyle(ingredient, index)}
            >
              {!dish.missingIngredients.includes(index) && ingredient}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Dish Attributes */}
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs border border-gray-700">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-400">Temperature:</span>
            <div className={`font-semibold ${getTemperatureColor()}`}>
              {dish.temperature}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Cook Level:</span>
            <div className={`font-semibold ${getCookLevelColor()}`}>
              {dish.cookLevel}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Plating:</span>
            <div className={`font-semibold ${getPlatingColor()}`}>
              {dish.platingQuality}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Missing:</span>
            <div className={`font-semibold ${dish.missingIngredients.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {dish.missingIngredients.length > 0 ? `${dish.missingIngredients.length} items` : 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dish;
