import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, X } from 'lucide-react';
import ModalOverlay from './ui/ModalOverlay';

const StaffManagementModal = ({ isOpen, onClose }) => {
  const { money, kitchenStaff, trainStaff, hireRunner } = useGame();

  // FIX: Updated keys to match GameContext (Capitalized)
  // FIX: Changed 'gardeManger' to 'Prep' to match the Context
  const stations = [
    { key: 'Grill', label: 'Grill Station', icon: '🥩' },
    { key: 'Sauté', label: 'Sauté Station', icon: '🍳' },
    { key: 'Prep', label: 'Prep Station', icon: '🥗' }, // Was 'gardeManger'
    // 'Pastry' might not exist in your basic context yet, so we'll check safely
  ];

  const renderStatBar = (current, max = 5, color = 'bg-blue-500') => (
    <div className="flex gap-1 h-2 w-24">
      {[...Array(max)].map((_, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${i < current ? color : 'bg-gray-700'}`}
        />
      ))}
    </div>
  );

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-900 border-2 border-slate-600 rounded-lg p-6 shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
          <div>
            <h2 className="text-3xl font-mono font-bold text-white tracking-tight">KITCHEN STAFF</h2>
            <p className="text-slate-400 font-mono text-sm">Manage skills and efficiency</p>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-xs uppercase">Funds Available</div>
            <div className="text-3xl font-mono text-green-400 font-bold">${money}</div>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {stations.map((station) => {
            // SAFE ACCESS: Check if station exists, default to dummy data if missing
            const stats = kitchenStaff[station.key] || { skill: 1, speed: 1 };

            // If the station literally doesn't exist in the save file, skip it or render safe default
            if (!kitchenStaff[station.key]) {
              // You can uncomment this to hide missing stations entirely
              // return null; 
            }

            const skillMaxed = stats.skill >= 5;
            const speedMaxed = stats.speed >= 5;
            const canAffordSkill = money >= 500;
            const canAffordSpeed = money >= 200;

            return (
              <div key={station.key} className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg hover:border-slate-500 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-2xl">{station.icon}</span> {station.label}
                  </h3>
                </div>

                {/* Skill Stat */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-300 font-bold flex items-center gap-1"><TrendingUp size={12} /> SKILL (Precision)</span>
                    <span className="text-slate-400">Lvl {stats.skill}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    {renderStatBar(stats.skill, 5, 'bg-blue-500')}
                    <Button
                      size="sm"
                      onClick={() => trainStaff(station.key)}
                      disabled={skillMaxed || !canAffordSkill}
                      className="bg-blue-900/40 hover:bg-blue-800 text-blue-200 border border-blue-800 h-8 text-xs font-mono w-32"
                    >
                      {skillMaxed ? 'MAXED' : 'TRAIN ($500)'}
                    </Button>
                  </div>
                </div>

                {/* Speed Stat */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-yellow-300 font-bold flex items-center gap-1"><Zap size={12} /> SPEED (Output)</span>
                    <span className="text-slate-400">Lvl {stats.speed}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    {renderStatBar(stats.speed, 5, 'bg-yellow-500')}
                    <Button
                      size="sm"
                      onClick={() => hireRunner(station.key)}
                      disabled={speedMaxed || !canAffordSpeed}
                      className="bg-yellow-900/40 hover:bg-yellow-800 text-yellow-200 border border-yellow-800 h-8 text-xs font-mono w-32"
                    >
                      {speedMaxed ? 'MAXED' : 'RUNNER ($200)'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-700">
          <Button onClick={onClose} variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white">
            <X className="mr-2 h-4 w-4" /> CLOSE MANAGER
          </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default StaffManagementModal;