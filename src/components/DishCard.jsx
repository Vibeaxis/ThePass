
import React from 'react';
import { motion } from 'framer-motion';
import Ticket from './Ticket';
import Dish from './Dish';
import { Button } from './ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

const DishCard = ({ recipe, dish, onService, onReject }) => {
  if (!recipe || !dish) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700"
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Ticket Side */}
        <div className="flex-shrink-0">
          <Ticket recipe={recipe} />
        </div>

        {/* Dish Side */}
        <div className="flex-1 flex flex-col items-center">
          <Dish dish={dish} recipe={recipe} />
          
          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 w-full max-w-xs">
            <Button
              onClick={onReject}
              variant="destructive"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg transition-all transform hover:scale-105"
            >
              <XCircle className="mr-2 h-5 w-5" />
              REJECT
            </Button>
            <Button
              onClick={onService}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg transition-all transform hover:scale-105"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              SERVICE
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DishCard;
